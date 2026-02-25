# Sacred Wallpaper Pack - Product Requirements Document
`Version 1.0.0 | FastAPI Implementation`

## 1. Product Overview

### 1.1 Product Description
Sacred Wallpaper Pack is a consciousness-optimizing web application that generates personalized wallpapers based on user's birth data, biorhythms, and Vedic astrological cycles (Vimshottari Dasha).

### 1.2 Core Features
- Personalized wallpaper generation using sacred geometry
- Birth data analysis and interpretation
- Biorhythm calculation and tracking
- Focus mode optimization
- Vedic astrology integration (Vimshottari Dasha)

### 1.3 Target Users
- Tech-savvy spiritual seekers
- Consciousness optimization enthusiasts
- Personal growth practitioners
- Digital wellness advocates

## 2. Technical Architecture

### 2.1 Technology Stack
- **Backend Framework**: FastAPI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **AI Integration**: Replicate API (SDXL Flux model)
- **Image Processing**: Pillow/OpenCV

### 2.2 Data Models

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    birth_data JSONB NOT NULL,
    current_dasha JSONB,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);
```

#### Wallpapers Table
```sql
CREATE TABLE wallpapers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    prompt_data JSONB NOT NULL,
    image_url TEXT NOT NULL,
    focus_mode TEXT NOT NULL,
    biorhythm_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### UserStates Table
```sql
CREATE TABLE user_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    current_biorhythm JSONB NOT NULL,
    current_focus_mode TEXT NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.3 API Endpoints

#### Authentication
```python
@app.post("/auth/register")
@app.post("/auth/login")
@app.post("/auth/refresh-token")
```

#### User Management
```python
@app.get("/users/me")
@app.put("/users/birth-data")
@app.get("/users/current-state")
```

#### Wallpaper Generation
```python
@app.post("/wallpapers/generate")
@app.get("/wallpapers/history")
@app.get("/wallpapers/{id}")
@app.post("/wallpapers/customize")
```

#### Calculations
```python
@app.get("/calculations/biorhythm")
@app.get("/calculations/dasha")
@app.post("/calculations/focus-mode")
```

## 3. Core Components

### 3.1 Authentication System
- Supabase Auth integration
- JWT token management
- Role-based access control
- Session management

### 3.2 Wallpaper Generation Engine
Integration with Replicate API using Flux model:

```python
class WallpaperGenerator:
    def __init__(self, api_token: str):
        self.client = replicate.Client(api_token=api_token)
        
    async def generate_wallpaper(
        self,
        focus_mode: str,
        energy_flow: str,
        birth_data: dict,
        biorhythm: dict
    ) -> str:
        # Map focus modes to prompts
        prompt_base = FOCUS_MODE_PROMPTS.get(focus_mode, {})
        
        # Generate using Flux model
        output = await self.client.run(
            "stability-ai/sdxl:flux",
            input={
                "prompt": self._build_prompt(
                    prompt_base,
                    energy_flow,
                    biorhythm
                ),
                "negative_prompt": "blurry, low quality, distorted, incorrect geometric proportions",
                "width": 1170,
                "height": 2532,
                "scheduler": "K_EULER",
                "num_outputs": 1,
                "guidance_scale": 7.5,
                "num_inference_steps": 50,
            }
        )
        return output[0]

    def _build_prompt(
        self,
        base: dict,
        energy_flow: str,
        biorhythm: dict
    ) -> str:
        # Implement sophisticated prompt building logic
        # based on user's current state and requirements
        pass
```

### 3.3 Calculation Services

#### 3.3.1 Vimshottari Dasha Calculator
```python
from dataclasses import dataclass
from typing import Dict, List
import math
import ephem
from datetime import datetime

@dataclass
class DashaPeriod:
    planet: str
    start_date: datetime
    end_date: datetime
    sub_periods: List['DashaPeriod'] = None

class VimshottariCalculator:
    DASHA_SEQUENCE = {
        'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10,
        'Mars': 7, 'Rahu': 18, 'Jupiter': 16, 'Saturn': 19,
        'Mercury': 17
    }
    
    NAKSHATRA_DEGREES = 13.33333  # 13°20'
    
    def __init__(self):
        self.moon = ephem.Moon()
        
    def calculate_moon_position(self, birth_date: datetime, lat: float, lon: float) -> float:
        observer = ephem.Observer()
        observer.lat = str(lat)
        observer.lon = str(lon)
        observer.date = birth_date
        
        self.moon.compute(observer)
        return math.degrees(float(self.moon.ra))
    
    def get_current_dasha(self, birth_date: datetime, lat: float, lon: float) -> DashaPeriod:
        moon_degree = self.calculate_moon_position(birth_date, lat, lon)
        
        # Calculate nakshatra and remaining balance
        nakshatra = math.floor(moon_degree / self.NAKSHATRA_DEGREES)
        balance = 1 - ((moon_degree % self.NAKSHATRA_DEGREES) / self.NAKSHATRA_DEGREES)
        
        return self._calculate_dasha_periods(birth_date, nakshatra, balance)
```

#### 3.3.2 Biorhythm Calculator
```python
from datetime import datetime, timedelta
import math

class BiorhythmCalculator:
    CYCLES = {
        'physical': 23,
        'emotional': 28,
        'intellectual': 33,
        'spiritual': 53
    }
    
    def calculate_biorhythm(
        self,
        birth_date: datetime,
        target_date: datetime = None
    ) -> dict:
        if target_date is None:
            target_date = datetime.now()
            
        days = (target_date - birth_date).days
        
        return {
            cycle: self._calculate_cycle(days, period)
            for cycle, period in self.CYCLES.items()
        }
    
    def _calculate_cycle(self, days: int, period: int) -> float:
        return math.sin(2 * math.pi * days / period) * 100
```

### 3.4 Focus Mode Optimizer
```python
class FocusModeOptimizer:
    def determine_optimal_mode(
        self,
        biorhythm: dict,
        dasha: DashaPeriod,
        user_preferences: dict
    ) -> str:
        scores = self._calculate_mode_scores(biorhythm, dasha, user_preferences)
        return max(scores.items(), key=lambda x: x[1])[0]
    
    def _calculate_mode_scores(
        self,
        biorhythm: dict,
        dasha: DashaPeriod,
        preferences: dict
    ) -> Dict[str, float]:
        return {
            'SYSTEM_OBSERVER': self._score_system_observer(biorhythm, dasha),
            'FIELD_PATTERN_RESET': self._score_field_pattern(biorhythm, dasha),
            'CORE_MATRIX': self._score_core_matrix(biorhythm, dasha)
        }
```

## 4. Implementation Requirements

### 4.1 Dependencies
```toml
[tool.poetry.dependencies]
python = "^3.9"
fastapi = "^0.68.0"
supabase-py = "^0.0.2"
python-jose = "^3.3.0"
pydantic = "^1.8.2"
pillow = "^8.3.1"
aiohttp = "^3.7.4"
ephem = "^4.1.4"
```

### 4.2 Environment Variables
```env
SUPABASE_URL=
SUPABASE_KEY=
REPLICATE_API_TOKEN=
JWT_SECRET=
```

### 4.3 Development Setup
```bash
# Install dependencies
poetry install

# Run development server
poetry run uvicorn app.main:app --reload

# Run tests
poetry run pytest
```

## 5. Deployment

### 5.1 Infrastructure Requirements
- Supabase project setup
- Replicate API access
- Docker container configuration
- CI/CD pipeline setup

### 5.2 Monitoring
- Error tracking
- Performance monitoring
- User analytics
- System health checks

## 6. Testing Strategy

### 6.1 Unit Tests
- API endpoint testing
- Data validation
- Calculation accuracy
- Image generation quality

### 6.2 Integration Tests
- Database operations
- External API integrations
- Authentication flows
- End-to-end workflows

## 7. Security Considerations

### 7.1 Data Protection
- Encryption at rest
- Secure data transmission
- Personal data handling
- GDPR compliance

### 7.2 API Security
- Rate limiting
- Input validation
- Token management
- Error handling

## 8. Performance Requirements

### 8.1 Response Times
- API endpoints: < 200ms
- Wallpaper generation: < 5s
- Image loading: < 1s
- Calculations: < 100ms

### 8.2 Scalability
- Support for 10,000+ users
- Concurrent wallpaper generation
- Efficient database queries
- Caching strategy

## 9. Future Considerations

### 9.1 Planned Features
- Mobile app integration
- Advanced customization options
- Social sharing capabilities
- Premium subscription features

### 9.2 Technical Debt
- Regular dependency updates
- Code refactoring plans
- Documentation maintenance
- Performance optimization

## 10. Technical Integration Specifications

### 10.1 Replicate API Integration

```python
ENVIRONMENT_CONFIG = {
    "REPLICATE_API_TOKEN": "Required for image generation",
    "MODEL_VERSION": "stability-ai/sdxl:flux-latest"
}

GENERATION_DEFAULTS = {
    "width": 1170,
    "height": 2532,
    "num_inference_steps": 50,
    "guidance_scale": 7.5,
    "scheduler": "K_EULER"
}

PROMPT_TEMPLATES = {
    "SYSTEM_OBSERVER": {
        "base": "Ultra detailed Metatron's Cube, sacred geometry mandala centered on vertical phone screen...",
        "energy_patterns": {
            "high": "dynamic upward-flowing energy streams...",
            "medium": "balanced bidirectional energy flows...",
            "low": "grounding downward energy patterns..."
        }
    }
}
```

### 10.2 Calculation Engine API
```python
@router.post("/calculations/dasha")
async def calculate_dasha(
    birth_data: BirthDataSchema,
    current_date: Optional[datetime] = None
):
    calculator = VimshottariCalculator()
    return calculator.get_current_dasha(
        birth_data.date,
        birth_data.latitude,
        birth_data.longitude
    )

@router.post("/calculations/biorhythm")
async def calculate_biorhythm(
    birth_data: BirthDataSchema,
    target_date: Optional[datetime] = None
):
    calculator = BiorhythmCalculator()
    return calculator.calculate_biorhythm(
        birth_data.date,
        target_date or datetime.now()
    )

@router.post("/calculations/focus-mode")
async def optimize_focus_mode(
    biorhythm: BiorhythmData,
    dasha: DashaPeriod,
    preferences: UserPreferences
):
    optimizer = FocusModeOptimizer()
    return optimizer.determine_optimal_mode(
        biorhythm,
        dasha,
        preferences
    )
```

---

This PRD serves as a living document and should be updated as the project evolves.
