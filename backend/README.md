
# RAG Assistant Backend API

This is the backend API for the RAG Assistant application, built with FastAPI.

## Features

- Authentication with JWT tokens
- Conversation management
- Document management with processing status tracking
- Tag management
- Settings management for LLM, embeddings, and vector database
- RAG system integration

## Setup

1. Clone the repository
2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and set your environment variables:
   ```
   cp .env.example .env
   ```
5. Run the application:
   ```
   uvicorn main:app --reload
   ```

## API Documentation

Once running, the API documentation is available at:
- Swagger UI: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc

## Project Structure

- `app/`: Main application package
  - `api/`: API endpoints
    - `api_v1/`: Version 1 API endpoints
      - `endpoints/`: Individual endpoint modules
  - `core/`: Core functionality (config, security)
  - `crud/`: Database operations
  - `db/`: Database models and session management
  - `schemas/`: Pydantic schemas for request/response validation
  - `services/`: Business logic services
- `tests/`: Test modules

## License

[MIT](LICENSE)
