# Aleena Amir - Editorial Fashion Prompts

Source: [https://x.com/aleenaamiir/status/2019342167102353672](https://x.com/aleenaamiir/status/2019342167102353672)

## 1. Defined From Every Angle (Grid/Contact Sheet)
A comprehensive prompt for generating a consistent character across a 3x3 grid with different poses and angles.

![Grid Contact Sheet](Images/grid_contact_sheet.jpg)

### Prompt (JSON)
```json
{
  "subject": {
    "identity_reference": "uploaded face and body reference",
    "identity_accuracy": "100% same facial structure, hair, skin tone, body shape, outfit, accessories; do not alter identity",
    "pose_variations": [
      {
        "name": "front-facing medium shot",
        "description": "upper to mid-body, facing camera directly, elegant and confident posture"
      },
      {
        "name": "front-facing extreme close-up",
        "description": "focus on face and eyes, capturing expression and makeup details"
      },
      {
        "name": "low-angle full-body shot",
        "description": "camera slightly below, looking upward, powerful stance emphasizing outfit and height"
      },
      {
        "name": "high-angle shot",
        "description": "slightly above, looking down, soft editorial perspective"
      },
      {
        "name": "side profile portrait",
        "description": "exact profile of face and hair, elegant posture, studio lighting highlights contours"
      },
      {
        "name": "34 profile (three-quarter turn)",
        "description": "torso and face turned three-quarters, emphasizing silhouette and outfit details"
      },
      {
        "name": "over-the-shoulder view",
        "description": "subject looks slightly away from camera, shoulder closest to camera in foreground"
      },
      {
        "name": "Dutch tilt",
        "description": "slightly rotated camera angle for dynamic editorial feel, maintaining consistent pose"
      },
      {
        "name": "mid-walk candid",
        "description": "natural motion captured, subtle step forward, relaxed arms, editorial energy"
      }
    ]
  },
  "wardrobe": {
    "description": "maintain exact outfit, fabric, and accessories as in identity reference",
    "consistency": "all panels must match perfectly"
  },
  "environment": {
    "setting": "studio environment",
    "background": "clean, minimal, neutral or light-grey cyclorama",
    "lighting": "soft professional studio lighting, subtle fill, flattering highlights"
  },
  "camera": {
    "shot_type": "varies per panel as specified",
    "angle": "specified per panel (low, high, front, profile, Dutch tilt, mid-motion)",
    "depth_of_field": "shallow, subject in sharp focus, blurred background"
  },
  "composition": {
    "grid": "3x3 contact sheet",
    "spacing": "consistent, balanced layout",
    "framing": "each panel fully showcases pose and outfit while keeping identity clear"
  },
  "aesthetic": {
    "style": "editorial fashion photography",
    "mood": "cinematic, professional, high-end",
    "color_palette": "maintain wardrobe and skin tones as reference, neutral background"
  },
  "render_quality": {
    "realism": "ultra-photorealistic",
    "resolution": "high (8K recommended)",
    "detail_focus": "fabric texture, skin, hair, accessories, lighting consistency across panels"
  },
  "negative_prompts": [
    "identity change",
    "distorted anatomy",
    "extra limbs",
    "blurred face",
    "motion artifacts",
    "low resolution",
    "inconsistent outfit or hair",
    "harsh shadows",
    "plastic skin",
    "busy background"
  ]
}
```

---

## 2. Crimson Confidence (Red Suit Fashion)
High-fashion editorial prompt for a fierce, predatory theatrical stance.

![Crimson Suit](Images/crimson_suit.jpg)

### Prompt (JSON)
```json
{
  "subject": {
    "identity_reference": "uploaded face reference",
    "identity_accuracy": "100% match in facial structure, eyes, lips, nose, jawline, hairline, natural skin texture; do not alter identity",
    "age_range": "adult woman",
    "pose": {
      "body_orientation": "standing, torso twisted, body turned at sharp angle",
      "shoulders": {
        "front_shoulder": "thrust forward prominently toward camera",
        "rear_shoulder": "pulled back"
      },
      "head": {
        "tilt": "chin down, head slightly lowered",
        "gaze": "eyes looking up from under brows, predatory intense gaze"
      },
      "arms": "hanging naturally or one hand in pocket",
      "hands": "bare, realistic fingers"
    },
    "expression": "fierce, predatory, intense, theatrical, smoldering gaze",
    "hair": "tight sleek bun"
  },
  "wardrobe": {
    "suit": {
      "blazer": {
        "color": "deep cherry red / burgundy",
        "fit": "oversized, exaggerated dropped-shoulder, structured broad shoulders, sharp shoulder pads, mid-thigh length",
        "front": "double-breasted, wide peak lapels, slightly boxy silhouette, sleeves slightly long"
      },
      "trousers": {
        "style": "high-waisted, ultra-wide-leg, deep front pleats, long hem pooling over heels"
      },
      "fabric": {
        "material": "premium heavy wool gabardine / wool twill",
        "texture": "dense, matte, slightly dry, visible diagonal twill weave, subtle creases, realistic drape",
        "finish": "no shine, no polyester look"
      }
    },
    "shirt": {
      "color": "crisp white poplin",
      "collar": "stiff, clean texture"
    },
    "tie": {
      "color": "deep cherry red",
      "material": "matte silk twill"
    },
    "accessories": {
      "earrings": "large gold hoop",
      "bracelet": "chunky gold on bare wrist"
    },
    "shoes": {
      "color": "burgundy",
      "style": "stiletto heels with ornate gold buckles"
    }
  },
  "environment": {
    "background": "seamless light-grey studio cyclorama",
    "studio": "clean, minimal, no props"
  },
  "camera": {
    "equipment": "Phase One XF, Schneider Kreuznach 80mm f/2.8 LS",
    "settings": {
      "aperture": "f/8",
      "ISO": 100,
      "shutter_speed": "1/160s"
    },
    "perspective": "vertical 3:4 full-body medium-to-long shot",
    "focus": "tack sharp face and fabric details"
  },
  "lighting": {
    "type": "soft diffused butterfly lighting",
    "fill": "subtle studio fill",
    "effect": "high-fashion clean illumination, emphasizes texture and drape"
  },
  "composition": {
    "framing": "full body, dramatic diagonal lines from torso twist, exaggerated theatrical stance",
    "balance": "centered subject with high-fashion editorial energy"
  },
  "aesthetic": {
    "style": "ultra-realistic high-fashion editorial",
    "mood": "theatrical, fierce, hunter energy, intense predatory attitude",
    "color_palette": ["deep cherry red", "burgundy", "gold accents", "white poplin"],
    "texture_focus": "hyper-realistic fabric, jewelry, skin, and hair textures"
  },
  "render_quality": {
    "resolution": "8K",
    "retouching": "clean, high-end studio retouch, pro color grading",
    "realism": "hyper-realistic, no extra limbs, no artifacts",
    "clarity": "tack sharp, accurate anatomical details"
  },
  "negative_prompts": [
    "glasses",
    "gloves",
    "motion blur",
    "low resolution",
    "extra limbs",
    "text or watermark",
    "plastic skin",
    "fabric shine",
    "incorrect anatomy",
    "cropped extremities"
  ]
}
```

---
*Extracted via OpenClaw on 2026-02-06*
