interface URL {
    lastmod: string;
    loc: string
    changefreq: "monthly" | "weekly" | "daily" | "yearly" | "always" | "never"
    priority: number
}


export default class Sitemap {

    private HEADING = `<?xml version="1.0" encoding="UTF-8"?>`

    public urls: URL[] = []
    public host = "https://backend.gudangkomik.com"


    private WRAP(str: string) {
        return `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${str}
</urlset>
        `
    }

    public add(url: URL) {
        this.urls.push(url)
    }

    public generate() {
        const url = this.urls.map(e => `
<url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
</url>
        `).join("")

        return this.WRAP(url)
    }
}