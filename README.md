# kuilinan.github.io

本仓库仅用于自动化部署，**不存放任何网站源码**。

## 结构

- `.github/workflows/deploy.yml` — 从 Release 下载加密包 → 解密 → 发布到 GitHub Pages
- `.github/workflows/cleanup.yml` — 清理历史运行记录

## 更新网站

1. 本地打包站点目录：`tar -czf site.tar.gz .`
2. 加密：`openssl enc -aes-256-cbc -pbkdf2 -salt -in site.tar.gz -out site.tar.gz.enc -pass pass:"$PASSWORD"`
3. 将 `site.tar.gz.enc` 作为附件上传到新的 Release
4. 手动触发 `Deploy Site from Encrypted Package` workflow

> 密码存于仓库 Secret `REMOTE_FILE_PASSWORD`，不落盘、不入库。
