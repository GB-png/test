#!/bin/bash

# 在root目录下新建文件夹
echo "新建数据库文件夹..."
mkdir -p /root/Rustdesk

# 启动docker
echo "docker运行服务"

sudo docker image pull rustdesk/rustdesk-server
sudo docker run --name hbbs -p 21115:21115 -p 21116:21116 -p 21116:21116/udp -p 21118:21118 -v /root/Rustdesk:/root -td  rustdesk/rustdesk-server hbbs 
sudo docker run --name hbbr -p 21117:21117 -p 21119:21119 -v /root/Rustdesk:/root -td  rustdesk/rustdesk-server hbbr

echo "打印密钥"
cat /root/Rustdesk/id_*.pub 


echo "完成！"
