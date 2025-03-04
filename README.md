# Language Learning AI Platform

This project is a React-based web application that provides an adaptive language learning platform powered by artificial intelligence. The application enables users to practice conversations in various languages through scenario-based learning, with real-time feedback, progress tracking, and personalized hints.

## Features

- **Multilingual Support**: Practice in multiple languages including English, Spanish, French, German, and more
- **Voice Interaction**: Text-to-speech and speech-to-text capabilities for pronunciation practice
- **Scenario-based Learning**: Engage in realistic conversations based on predefined scenarios
- **Adaptive Learning**: System adjusts to user's proficiency level
- **Real-time Feedback**: Get immediate feedback on grammar, vocabulary, and fluency
- **Goal Tracking**: Monitor progress through clearly defined conversation goals
- **Learning Analytics**: View detailed progress reports and historical performance

## Technology Stack

- **Framework**: Next.js with React 19
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: Zustand and React Query
- **Authentication**: Custom authentication with session management
- **Internationalization**: next-intl for multilingual support
- **Data Validation**: Zod for type-safe schema validation
- **API Communication**: Axios for API requests
- **UI Components**: Custom components built on assistant-ui library

## Research Paper

This project implements the adaptive language learning approach described in our research paper. The complete research, methodology, and findings are available in the following repository:

[Language Learning Research Paper Repository](https://github.com/EmaSuriano/language-learning-paper)

The paper explores the effectiveness of AI-powered conversation practice for language acquisition, the impact of immediate feedback on learning outcomes, and techniques for adaptive difficulty scaling based on learner proficiency.

## Backend Repository

The backend implementation for this project is available in a separate repository:

[Language Learning Server Repository](https://github.com/EmaSuriano/language-learning-server)

This server provides the API endpoints, natural language processing capabilities, and data management needed to power the language learning experience.

## Getting Started

### Prerequisites

- Node.js 20 or higher
- A running instance of the language learning API

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/language-learning-client.git
   cd language-learning-client
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:

   ```
   NEXT_PUBLIC_ASSISTANT_URL=http://your-api-url
   ```

4. Start the development server

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Screens

https://private-user-images.githubusercontent.com/3399429/411693357-f1b262b1-1383-4d23-9129-9248839b5944.png

| Screen                                                                                                | Description                                                                                      |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| ![Situation Picker](https://github.com/user-attachments/assets/97c3e4e6-2a75-4d90-a2e9-422afb081344)  | **Situation Picker**: Select language learning scenarios based on difficulty level and context   |
| ![Initial Chat](https://github.com/user-attachments/assets/0a7c314e-265f-41fa-9d17-8f3350409544)      | **Initial Chat**: Beginning of a conversation with instructions and context                      |
| ![Chat Interface](https://github.com/user-attachments/assets/193bb62f-df19-4fe2-8590-101da4a17d2e)    | **Chat Interface**: Interactive conversation with real-time feedback and assistance              |
| ![Evaluation Report](https://github.com/user-attachments/assets/bee6d9a3-fa35-4c59-a5b1-3bcf97697e05) | **Evaluation Report**: Detailed assessment of the conversation with language proficiency metrics |
| ![Learning History](https://github.com/user-attachments/assets/ad93d8a8-11fb-47ea-affe-df486ab89197)  | **Learning History**: Visualization of progress and performance over time                        |

## Application Structure

- **app/**: Next.js app directory containing routes and layouts
- **components/**: Reusable UI components
- **hooks/**: Custom React hooks for data fetching and state management
- **lib/**: Utility functions and configuration
- **public/**: Static assets

## Key Components

- **MyAssistant**: Main conversation interface
- **SituationSettings**: Interface for selecting learning scenarios
- **ProgressTracker**: Real-time tracking of conversation goals
- **LearningHistory**: Historical performance visualization
- **AudioRecorder**: Voice input component
- **ReportDialog**: Comprehensive session analysis

## API Integration

The application communicates with a language learning API that handles:

- Natural language processing for conversation
- Speech synthesis and recognition
- Progress tracking and learning analytics
- User management and session history

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
