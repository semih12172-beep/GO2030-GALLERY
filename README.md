# Gallery PWA

极简个人相册，支持照片 + 视频，部署到 Cloudflare Pages。

## 文件结构

```
gallery/
  index.html            ← 主页面（PWA shell）
  sw.js                 ← Service Worker（离线缓存）
  manifest.webmanifest  ← PWA 配置
  data.json             ← ★ 你的媒体索引，唯一需要编辑的文件
  icons/
    icon-192.png        ← PWA 图标（需自己提供）
    icon-512.png
```

## data.json 格式

```json
{
  "title": "My Gallery",
  "categories": [
    {
      "name": "旅行",       // 显示名称
      "slug": "travel",    // URL/内部标识，英文无空格
      "items": [
        {
          "type": "photo",                          // "photo" 或 "video"
          "src":   "https://r2.xxx.com/img.jpg",   // 原图/视频 URL
          "thumb": "https://r2.xxx.com/t/img.jpg", // 缩略图 URL
          "w": 3024,                               // 原始宽（像素）
          "h": 4032,                               // 原始高（像素）
          "caption": "Tokyo 2023"                  // 说明文字，可留空 ""
        }
      ]
    }
  ]
}
```

### 关于缩略图

推荐用 Cloudflare Images 的变换 URL 生成缩略图，例如：
```
https://imagedelivery.net/<accounthash>/<imageId>/w=400
```
或者在 R2 旁边放一份压缩版的 `thumbs/` 目录。

### video 的 thumb

视频封面图需要手动截帧或用 ffmpeg 批量生成：
```bash
ffmpeg -i input.mp4 -ss 00:00:01 -vframes 1 thumb.jpg
```

---

## 部署到 Cloudflare Pages

1. 将整个文件夹推送到 GitHub 仓库
2. Cloudflare Dashboard → Pages → Create Project → 连接仓库
3. Build command: 留空（纯静态）
4. Build output: `/`（根目录）
5. 绑定自定义域名

更新内容只需更新 `data.json`，重新推送即可。

---

## R2 CORS 配置

在 R2 Bucket Settings → CORS Policy 添加：

```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com"],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 86400
  }
]
```

---

## PWA 图标

用任意图片生成 192×192 和 512×512 的 PNG 放入 `icons/` 目录。
推荐工具：https://maskable.app/editor
