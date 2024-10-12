#!/bin/bash

# 在root目录下新建文件夹
echo "新建数据库文件夹..."
mkdir -p /root/FileBrowser/File/
mkdir -p /root/FileBrowser/database

# 启动docker，映射端口9999
echo "启动docker，映射端口9999..."

docker run -d \
  -v /root/FileBrowser/File/:/srv \
  -v /root/FileBrowser/database:/database \
  -p 9999:80 \
  --name filebrowser \
  filebrowser/filebrowser

echo "完成！"
