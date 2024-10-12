#!/bin/bash

# 更新系统软件包列表
echo "更新系统..."
sudo apt update -y && sudo apt upgrade -y

# 安装常用工具
echo "安装常用工具..."
sudo apt install -y \
    sudo \
    vim \
    nano \
    curl \
    wget \
    unzip \
    zip \
    htop \
    screen \
    bash-completion \
    lsb-release \


# 清理不必要的包
echo "清理系统..."
sudo apt autoremove -y

echo "常用工具安装完成！"