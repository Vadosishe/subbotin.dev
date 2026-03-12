import { siteConfig } from "@/data/siteConfig";
import { useLanguage } from "@/components/LanguageProvider";

export function StatusWidget() {
    const { t } = useLanguage();

    return (
        <div className="p-6 flex flex-col justify-center items-center text-center h-full min-h-[140px] relative">
            <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-3 w-3">
                    {siteConfig.status.online ? (
                        <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </>
                    ) : (
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500"></span>
                    )}
                </span>
                <span className={`text-sm font-semibold uppercase tracking-wider ${siteConfig.status.online ? 'text-green-500' : 'text-gray-500'}`}>
                    {t({ ru: "Статус", en: "Status" })}
                </span>
            </div>
            <p className="font-medium">{t(siteConfig.status.text)}</p>
        </div>
    );
}
