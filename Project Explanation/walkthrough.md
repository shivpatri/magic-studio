# AI-Powered Headshot Cropping Tool Implementation Walkthrough

The application has been successfully implemented according to your requirements. Here is a summary of what was accomplished and how it functions.

## Implementation Details

### Project Setup
- Bootstrapped a new Next.js 14+ application using TypeScript and the App Router.
- Configured a modern, visually striking UI using **Tailwind CSS** with a custom dark theme built into `globals.css`.
- Installed necessary dependencies: `react-image-crop`, `react-dropzone`, `react-hot-toast`, and `lucide-react`.

### 1. Photo Upload Component
- Created `PhotoUpload.tsx` utilizing `react-dropzone`.
- **Drag-and-Drop / Fallback Picker**: Users can easily drop images or click to select a file.
- **Validation**: Enforced strict validation for JPEGs, PNGs, and WebP, with a max file size of 10 MB. Clean inline error messages show up immediately upon validation failure.

### 2. AI Crop Suggestion
- Implemented `calculateAICrop` in `src/lib/cropUtils.ts`.
- **Heuristic**: This deterministic function scales the crop area appropriately based on the image size and places the box exactly in the upper-center third to target the typical location of a face in a portrait photo.
- The initial load of the image automatically invokes this function to render the initial AI-suggested crop area.

### 3. Interactive Crop Editor
- Created `CropEditor.tsx` built around `react-image-crop`.
- The crop area is visually distinct, muting the outer regions and clearly bounding the suggested area.
- **Interactivity**: Users can freely resize by dragging corners/edges or reposition the box entirely.
- **UI Controls**: 
  - **Reset to AI Suggestion** recalculates and snaps the selection back to the algorithm's recommendation.
  - Quick toggles to lock the aspect ratio to standard portrait formats (`3:4`, `4:5`, `1:1`, or `Free`).

### 4. Client-side Export
- Added the logic to `cropUtils.ts` and `CropEditor.tsx`.
- Uses the HTML `<canvas>` API to draw just the selected portion of the image.
- Automatically handles device pixel ratios for high-quality export.
- Converts the canvas to a JPEG Blob and triggers a native browser download, accompanied by a quick success toast notification.

## Verification

- **Code Quality**: Verified no type issues and successfully built the optimized production bundle (`npm run build`).
- **Aesthetics & UX**: Added premium hover states, active states, and a beautiful background gradient with subtle translucency.
- **Responsiveness**: Used Tailwind’s flex and grid utilities to ensure the editor splits to a top/bottom stack on mobile/tablet and left/right on desktop. 

## Next Steps
You can run the application locally by executing:
```bash
npm run dev
```

Let me know if you would like to refine any design elements, micro-animations, or fine-tune the AI crop heuristics further!
