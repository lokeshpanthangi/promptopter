# 🚀 Prompt Optimizer

An intelligent prompt optimization tool powered by GPT-4.1 and a comprehensive knowledge base. Transform your prompts for maximum effectiveness across 49 different AI tools and development platforms.

## 🎯 Overview

Prompt Optimizer uses an innovative approach combining **GPT-4.1's intelligence** with **tool-specific optimization strategies** to enhance your prompts for better results across various AI tools, IDEs, frameworks, and platforms.

### 🧠 Our Approach

We've developed a unique **Knowledge-Driven Optimization** system:

1. **📚 Knowledge Base**: Curated optimization strategies for 49 tools stored in `Knowledge.json`
2. **🤖 AI-Powered Analysis**: GPT-4.1 analyzes your prompt using tool-specific strategies
3. **⚡ Intelligent Optimization**: Combines human expertise with AI intelligence for superior results
4. **📊 Structured Output**: Provides optimized prompts with detailed analysis

## ✨ Features

- 🎨 **49 Supported Tools**: AI assistants, IDEs, frameworks, cloud platforms, and more
- 🧪 **GPT-4.1 Integration**: Latest OpenAI model for intelligent optimization
- 📋 **One-Click Copy**: Copy optimized prompts to clipboard instantly
- 🔍 **Detailed Analysis**: Get insights on intent, complexity, and improvements
- 🎯 **Tool-Specific Strategies**: Tailored optimization for each platform
- 🔐 **Secure API Management**: Safe handling of OpenAI API keys
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🎭 **Modern UI**: Beautiful interface built with shadcn/ui

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **AI Integration**: OpenAI GPT-4.1 API
- **State Management**: React hooks
- **Icons**: Lucide React
- **Notifications**: Toast notifications

## 🚀 Quick Start

### 📋 Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd promptopter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_OPENAI_MODEL=gpt-4o
   VITE_OPENAI_MAX_TOKENS=2000
   VITE_OPENAI_TEMPERATURE=0.7
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 🎮 Usage

### 🔧 Basic Workflow

1. **📝 Enter Your Prompt**: Type the prompt you want to optimize
2. **🎯 Select Tool**: Choose from 49 available tools/platforms
3. **⚡ Optimize**: Click "Analyze & Optimize Prompt" 
4. **📋 Copy Result**: Use the copy button to get your optimized prompt

### 🧪 Testing Integration

Visit `/test` route to test the OpenAI integration and debug any issues.

## 🏗 Architecture

### 📁 Project Structure

```
src/
├── components/
│   ├── ApiKeySetup.tsx      # 🔐 API key configuration
│   ├── PromptOptimizer.tsx  # 🎯 Main optimization interface
│   ├── TestOptimization.tsx # 🧪 Testing component
│   └── ui/                  # 🎨 shadcn/ui components
├── services/
│   └── openai.ts           # 🤖 OpenAI API integration
├── pages/
│   ├── Index.tsx           # 🏠 Home page
│   └── NotFound.tsx        # 404 page
└── hooks/                  # ⚡ Custom React hooks
```

### 🔄 Data Flow

1. **User Input** → Prompt + Tool Selection
2. **Knowledge Lookup** → Fetch strategies from `Knowledge.json`
3. **API Request** → Send to GPT-4.1 with context
4. **Response Processing** → Parse and structure result
5. **UI Update** → Display optimized prompt + analysis

## 📚 Knowledge Base

Our `Knowledge.json` contains optimization strategies for:

### 🤖 AI Tools
- ChatGPT, Claude, Gemini, Copilot
- Midjourney, DALL-E, Perplexity
- Mistral, Grok

### 💻 IDEs & Editors
- VS Code, IntelliJ, WebStorm, PyCharm
- Eclipse, Sublime Text, Atom, Vim, Emacs

### 🌐 Web Frameworks
- React, Vue.js, Angular, Svelte
- Next.js, Nuxt.js, Gatsby

### 🗄 Backend & Database
- Node.js, Express.js
- MongoDB, PostgreSQL, MySQL

### ☁️ Cloud & DevOps
- AWS, Azure, Google Cloud
- Docker, Kubernetes

### 🔧 Version Control
- Git, GitHub, GitLab

### 📱 Mobile Development
- React Native, Flutter, Ionic

### 🎨 Design Tools
- Figma, Sketch, Adobe XD

### 📊 Analytics
- Google Analytics, Mixpanel, Hotjar

## 🔧 Configuration

### 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| `VITE_OPENAI_API_KEY` | OpenAI API key | Required |
| `VITE_OPENAI_MODEL` | GPT model to use | `gpt-4o` |
| `VITE_OPENAI_MAX_TOKENS` | Maximum response tokens | `2000` |
| `VITE_OPENAI_TEMPERATURE` | Response creativity (0-1) | `0.7` |

### 🎛 Customization

- **Add New Tools**: Update `Knowledge.json` and `TOOLS` object in `PromptOptimizer.tsx`
- **Modify Strategies**: Edit optimization strategies in `Knowledge.json`
- **Adjust UI**: Customize components in `src/components/`
- **Change Models**: Update `VITE_OPENAI_MODEL` in `.env`

## 🧪 Development

### 📝 Available Scripts

```bash
npm run dev          # 🚀 Start development server
npm run build        # 📦 Build for production
npm run preview      # 👀 Preview production build
npm run lint         # 🔍 Run ESLint
```

### 🐛 Debugging

1. **Check Console**: Open browser DevTools for detailed logs
2. **Test Route**: Visit `/test` to verify OpenAI integration
3. **API Key**: Ensure your OpenAI API key is valid and has credits
4. **Network**: Check for CORS or network issues

## 🚀 Deployment

### 📦 Build for Production

```bash
npm run build
```

### 🌐 Deploy Options

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **AWS S3**: Upload build files to S3 bucket
- **GitHub Pages**: Use GitHub Actions for deployment

### 🔒 Security Notes

- ⚠️ **Never commit API keys** to version control
- 🔐 Use environment variables for sensitive data
- 🛡️ Consider implementing rate limiting for production
- 🔑 Rotate API keys regularly

## 🤝 Contributing

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **💾 Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **📤 Push** to the branch (`git push origin feature/amazing-feature`)
5. **🔄 Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- 🤖 **OpenAI** for providing the GPT-4.1 API
- 🎨 **shadcn/ui** for beautiful UI components
- ⚡ **Vite** for lightning-fast development
- 🎯 **Tailwind CSS** for utility-first styling

## 📞 Support

If you encounter any issues or have questions:

- 🐛 **Bug Reports**: Open an issue on GitHub
- 💡 **Feature Requests**: Create a feature request issue
- 📧 **General Questions**: Start a discussion

---

**Made with ❤️ and powered by GPT-4.1**
