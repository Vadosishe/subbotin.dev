// src/lib/github.ts

/**
 * Commits multiple files (create, update, or delete) to a GitHub repository in a single commit,
 * using the lower-level Git Database API (Trees, Commits, Refs).
 */

export async function commitMultipleFiles({
    files,
    commitMessage,
    githubToken,
    repoOwner,
    repoName,
    branch = "main"
}: {
    files: { path: string, content: string | null }[], // null content means delete
    commitMessage: string,
    githubToken: string,
    repoOwner: string,
    repoName: string,
    branch?: string
}) {
    const baseUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;
    const headers = {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'subbotin-dev-cms',
        'Accept': 'application/vnd.github.v3+json'
    };

    // 1. Get current commit object
    const refRes = await fetch(`${baseUrl}/git/refs/heads/${branch}`, { headers });
    if (!refRes.ok) throw new Error("Could not fetch branch ref");
    const refData = await refRes.json();
    const latestCommitSha = refData.object.sha;

    // 2. Get current tree
    const commitRes = await fetch(`${baseUrl}/git/commits/${latestCommitSha}`, { headers });
    if (!commitRes.ok) throw new Error("Could not fetch latest commit");
    const commitData = await commitRes.json();
    const baseTreeSha = commitData.tree.sha;

    // 3. Create tree items
    const tree = files.map(file => {
        if (file.content === null) {
            // Deleting a file
            return {
                path: file.path,
                mode: '100644',
                type: 'blob',
                sha: null // setting sha to null in tree marks for deletion
            };
        } else {
            // Creating or updating a file
            return {
                path: file.path,
                mode: '100644',
                type: 'blob',
                content: file.content
            };
        }
    });

    // 4. Create new tree
    const newTreeRes = await fetch(`${baseUrl}/git/trees`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            base_tree: baseTreeSha,
            tree: tree
        })
    });
    if (!newTreeRes.ok) throw new Error("Could not create new tree");
    const newTreeData = await newTreeRes.json();
    const newTreeSha = newTreeData.sha;

    // 5. Create new commit
    const newCommitRes = await fetch(`${baseUrl}/git/commits`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            message: commitMessage,
            tree: newTreeSha,
            parents: [latestCommitSha]
        })
    });
    if (!newCommitRes.ok) throw new Error("Could not create new commit");
    const newCommitData = await newCommitRes.json();
    const newCommitSha = newCommitData.sha;

    // 6. Update reference
    const updateRefRes = await fetch(`${baseUrl}/git/refs/heads/${branch}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
            sha: newCommitSha
        })
    });
    
    if (!updateRefRes.ok) throw new Error("Could not update branch ref");
    return newCommitSha;
}
