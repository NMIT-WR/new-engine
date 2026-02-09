import { createServer } from "node:http"
import { promises as fs } from "node:fs"
import path from "node:path"

const host = process.env.HOST ?? "127.0.0.1"
const args = process.argv.slice(2)
const portFlagIndex = args.findIndex((arg) => arg === "--port" || arg === "-p")
const port =
  portFlagIndex >= 0 && args[portFlagIndex + 1]
    ? Number(args[portFlagIndex + 1])
    : Number(process.env.PORT ?? 6006)

const rootDir = process.cwd()
const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".gif", "image/gif"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
])

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, headers)
  res.end(body)
}

const resolvePath = (pathname) => {
  const normalized = path.normalize(pathname).replace(/^([.][.][/\\])+/, "")
  return path.join(rootDir, normalized)
}

createServer(async (req, res) => {
  const method = req.method ?? "GET"
  if (method !== "GET" && method !== "HEAD") {
    send(res, 405, "Method Not Allowed", {
      "content-type": "text/plain; charset=utf-8",
    })
    return
  }

  try {
    const requestUrl = new URL(req.url ?? "/", `http://${host}:${port}`)
    let pathname = decodeURIComponent(requestUrl.pathname)
    if (pathname === "/") pathname = "/index.html"

    const filePath = resolvePath(pathname)
    if (!filePath.startsWith(rootDir)) {
      send(res, 403, "Forbidden", { "content-type": "text/plain; charset=utf-8" })
      return
    }

    let stat
    try {
      stat = await fs.stat(filePath)
    } catch {
      send(res, 404, "Not Found", {
        "content-type": "text/plain; charset=utf-8",
      })
      return
    }

    const finalPath = stat.isDirectory()
      ? path.join(filePath, "index.html")
      : filePath
    const data = await fs.readFile(finalPath)
    const contentType =
      mimeTypes.get(path.extname(finalPath)) ?? "application/octet-stream"

    res.writeHead(200, {
      "content-type": contentType,
      "cache-control": "no-store",
      "content-length": data.length,
    })

    if (method === "HEAD") {
      res.end()
      return
    }

    res.end(data)
  } catch (error) {
    send(res, 500, `Server error: ${String(error)}`, {
      "content-type": "text/plain; charset=utf-8",
    })
  }
}).listen(port, host)
