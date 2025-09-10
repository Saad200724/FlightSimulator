# Flight Simulator Application

## Overview

This is a 3D flight simulator web application built with React, Three.js, and TypeScript. The application allows users to select from different aircraft types and fly them in a 3D environment with realistic physics simulation. It features multiple camera modes, aircraft selection, flight controls, and a heads-up display (HUD) showing flight data.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool
- **3D Graphics**: React Three Fiber (@react-three/fiber) for Three.js integration
- **3D Components**: React Three Drei (@react-three/drei) for additional 3D utilities
- **State Management**: Zustand for global state management with middleware support
- **Styling**: Tailwind CSS with custom design system variables
- **UI Components**: Radix UI components with custom styling via shadcn/ui patterns

**Key State Management Stores**:
- `useFlightSimulator`: Manages aircraft state, position, rotation, velocity, camera modes, and HUD data
- `useGame`: Handles game phases (ready, playing, ended)
- `useAudio`: Controls audio playback and muting functionality

**Component Structure**:
- Aircraft selection interface with cards showing aircraft specifications
- 3D flight simulator with terrain, aircraft models, and environmental lighting
- Multiple camera controllers (chase, cockpit, free cam)
- Real-time HUD displaying altitude, speed, heading, throttle, and fuel
- Keyboard controls for flight simulation

### Backend Architecture

**Server Framework**: Express.js with TypeScript
- **Development Setup**: Vite integration for hot module replacement in development
- **Production Build**: ESBuild for server-side bundling
- **Static Serving**: Serves built React application in production
- **API Structure**: Modular route registration system with centralized error handling
- **Storage Interface**: Abstract storage interface with in-memory implementation for user management

**Key Backend Components**:
- Modular route registration system in `server/routes.ts`
- Abstract storage interface supporting CRUD operations
- Development middleware for request logging and performance monitoring
- Error handling middleware with proper HTTP status codes

### Database & Schema

**ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured via Neon Database Serverless adapter)
- **Schema Definition**: Shared schema definitions in TypeScript
- **Validation**: Zod schemas for type-safe data validation
- **Migrations**: Drizzle Kit for database migrations and schema management

**Current Schema**:
- Users table with username/password authentication
- Type-safe insert and select operations
- Shared types between frontend and backend

### Data Storage Solutions

**Primary Database**: PostgreSQL via Neon Database Serverless
- Connection pooling and serverless optimization
- Environment-based configuration
- Migration support through Drizzle Kit

**Development Storage**: In-memory storage implementation
- Fallback storage for development and testing
- Implements the same interface as database storage
- User management with auto-incrementing IDs

### Authentication & Authorization

**Current Implementation**: Basic user storage structure
- User model with username and password fields
- Storage interface designed for extensible authentication
- Type-safe user creation and retrieval methods

### Game Physics & 3D Rendering

**Physics Engine**: Custom flight physics implementation
- Aircraft-specific performance characteristics (speed, maneuverability, fuel efficiency)
- Real-time position, rotation, and velocity calculations
- Throttle, pitch, yaw, and roll controls
- Fuel consumption simulation

**3D Rendering Pipeline**:
- Three.js scene management through React Three Fiber
- Environmental lighting with ambient and directional lights
- Shadow mapping for realistic terrain interaction
- Terrain generation with procedural features
- Aircraft model rendering with propeller animations

### Input System

**Keyboard Controls**: Comprehensive flight control mapping
- WASD for throttle and yaw control
- IJKL for pitch and roll control
- Camera switching and reset functionality
- KeyboardControls integration with React Three Fiber

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database operations and migrations

### 3D Graphics Libraries
- **Three.js**: Core 3D graphics engine
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Additional 3D utilities and helpers
- **React Three Postprocessing**: Post-processing effects pipeline

### UI & Styling
- **Radix UI**: Headless UI component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Class Variance Authority**: Component variant management
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety and development experience
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing with Tailwind integration

### State Management & Utilities
- **Zustand**: Lightweight state management
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form validation and management
- **Date-fns**: Date manipulation utilities

### Font & Assets
- **Inter Font**: Primary typeface via Fontsource
- **GLSL Shader Support**: Custom shader loading via Vite plugin
- **Asset Loading**: Support for 3D models (GLTF/GLB) and audio files