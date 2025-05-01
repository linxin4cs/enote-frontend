# ENote-Frontend

本仓库包含云笔记平台的前端源代码，作为本科毕业设计的一部分开发。该平台为用户提供一个现代化、响应式的界面，用于跨设备创建、管理和访问笔记。

## 项目简介

本前端应用基于 B/S 架构和前后端分离模式开发，旨在为用户提供一个功能丰富、界面简洁、体验良好的云笔记服务。主要运用了 Vue 3 技术栈，实现了响应式布局，适配 PC 和移动端浏览器。

## 截屏预览

**PC 端用户界面：**  
![PC User View](./assets/PC%20端用户界面.png)

**移动端用户界面：**  
<img src="./assets/移动端用户界面.png" style="width: 30%"></img>

**PC 端管理后台：**  
![PC Admin View](./assets/PC%20端管理后台.png)

**移动端管理后台：**  
<img src="./assets/移动端管理后台.png" style="width: 30%"></img>

**登录 / 注册界面：**  
<img src="./assets/登陆界面.png" style="width: 30%"></img>
<img src="./assets/注册界面.png" style="width: 30%"></img>

## 主要功能 (Features)

### 用户认证
- 用户注册（邮箱验证）
- 用户登录
- 忘记密码（邮箱验证重置）
- “记住我”自动登录（持久化令牌）
- 权限管理（普通用户、普通管理员、超级管理员）
- 用户状态管理（启用 / 禁用）

### 笔记管理
- 创建 / 删除 / 重命名笔记
- 富文本编辑（支持文本、图片、视频、音频嵌入 - 使用 WangEditor 5）
- 内容即时 / 自动保存
- 笔记列表展示（摘要、更新时间）
- 关键字检索（模糊匹配，大小写不敏感）
- 笔记大纲查看
- 收藏 / 取消收藏
- 移动笔记至不同文件夹
- 为笔记添加 / 删除标签

### 文件夹与标签管理
- 创建 / 删除 / 重命名文件夹和标签
- 移动文件夹
- 按文件夹、标签、收藏状态、关键字筛选笔记
- 右键菜单操作（笔记、文件夹、标签）— 使用 Vue3 Context Menu 实现

### 文件管理
- 上传用户头像
- 上传 / 访问 / 删除笔记中的图片、视频、音频  
  _（删除操作关联笔记内容变更）_

### 用户中心
- 查看 / 修改个人信息（用户名、邮箱、密码、头像）  
  _（敏感操作需邮箱验证）_
- 删除账号（邮箱验证）

### 数据分析（用户端）
- 统计个人笔记、文件夹、收藏、标签、多媒体文件数量
- 可视化显示个人存储用量（笔记与多媒体）

### 数据分析（管理端）
- 查看平台用户总数、日新增、周新增、日活跃、周活跃及趋势
- 查看平台笔记总数、日新增、周新增、日活跃、周活跃及趋势
- 查看平台文件（图片 / 视频 / 音频）总数、存储用量及趋势
- 图表展示使用 AntV G2 实现

### 管理后台
- 用户管理（创建、查询、编辑、删除）  
  _（管理员不可编辑 / 删除权限等于或高于自身的用户）_
- 平台数据维护（备份 / 恢复 - 界面模拟）

### 其他
- 响应式布局（同时适配 PC 与移动端）
- 简洁美观的 UI 界面（基于 Element Plus 和 TailwindCSS）

## 技术栈 (Technology Stack)

- **框架：** Vue.js 3（Composition API）
- **构建工具：** Vite
- **UI 库：** Element Plus
- **路由：** Vue Router
- **状态管理：** Pinia
- **HTTP 客户端：** Axios
- **富文本编辑器：** WangEditor 5
- **数据可视化：** AntV G2
- **右键菜单：** Vue3 Context Menu
- **CSS 框架：** TailwindCSS
- **核心语言：** JavaScript (ES6+) / 可选 TypeScript
- **包管理工具：** NPM / Yarn / PNPM

## 项目结构 (Project Structure)

```
enote-frontend/
├── public/
│   └── favicon.ico               # 网站图标
├── src/
│   ├── assets/                   # 静态资源（图片、字体等）
│   ├── components/              # 可复用组件（按 admin, auth, layout, user 分类）
│   ├── router/                  # 路由配置（router.js）
│   ├── store/                   # 状态管理（Pinia store.js）
│   ├── styles/                  # 全局样式（style.css）
│   ├── utils/                   # 工具函数（常量、格式化、封装请求、校验器等）
│   ├── views/                   # 页面组件
│   ├── App.vue                  # 根组件
│   └── main.js                  # 应用入口
├── .env.development             # 开发环境变量（示例）
├── index.html                   # HTML 入口
├── package.json                 # 项目依赖和脚本
├── vite.config.js               # Vite 配置文件
└── tailwind.config.js           # TailwindCSS 配置
```

## 本地运行 (Getting Started)

### 先决条件

- Node.js (推荐 >=16.x)
- NPM 或 Yarn 或 PNPM

### 安装与运行

1. **克隆仓库**
    ```bash
    git clone git@github.com:linxin4cs/enote-frontend.git
    cd enote-frontend
    ```

2. **安装依赖**
    ```bash
    npm install
    # 或
    yarn install
    # 或
    pnpm install
    ```

3. **配置环境变量**
    在项目根目录下创建 `.env.development` 文件，添加以下内容：

    ```env
    VITE_API_BASE_URL=http://localhost:8080/api
    ```
    _（请根据你的后端地址和端口进行修改）_

4. **运行开发服务器**
    ```bash
    npm run dev
    # 或
    yarn dev
    # 或
    pnpm dev
    ```

    应用将在 `http://localhost:5173`（或 Vite 指定的端口）访问。

5. **构建生产版本**
    ```bash
    npm run build
    # 或
    yarn build
    # 或
    pnpm build
    ```

    构建结果将在 `dist/` 目录下。

## API 交互 (API Interaction)

此前端应用需与对应的 **云笔记平台后端服务** 进行交互。请确保后端服务已运行，并在 `.env.development` 中正确配置了 `VITE_API_BASE_URL`。

后端仓库地址：https://github.com/linxin4cs/enote-backend