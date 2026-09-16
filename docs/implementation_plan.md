# AI-Powered Headshot Cropping Tool

Based on the provided document, here is the technical plan to implement the single-page Next.js application for uploading, AI-suggested cropping, interactively editing, and exporting portrait photos.

## User Review Required

Please review the proposed tech stack and the implementation steps below. If you approve, I will proceed with creating the application.

> [!NOTE]
> The document allows the use of open-source libraries. For the interactive crop editor, I suggest using `react-image-crop` as it is lightweight, handles interactive dragging/resizing, and works well with React and TypeScript. Alternatively, we can use `Cropper.js`. Let me know if you prefer a specific library.

## Open Questions

- Do you have a preference between using `react-image-crop`, `Cropper.js`, or building the crop interactive UI entirely from scratch? (I recommend `react-image-crop` for React integration).
- Are there any specific brand colors or fonts you want to be used for the UI? (Otherwise, I'll use a premium modern aesthetic with TailwindCSS).

## Proposed Changes

### 1. Project Initialization
- Initialize a new Next.js 14+ project in the workspace using TypeScript and Tailwind CSS.
- Set up a premium modern design system (fonts, colors, micro-animations) in `globals.css` and `tailwind.config.ts`.
- Install necessary dependencies (e.g., `react-image-crop`, `lucide-react` for icons, `react-hot-toast` for notifications).

### 2. Photo Upload Component
- Create a `PhotoUpload` component.
- Implement a drag-and-drop zone using standard HTML5 APIs or `react-dropzone`.
- Include a fallback file picker (`<input type="file" />`).
- Add client-side validation:
  - Allowed types: JPEG, PNG, WebP.
  - Maximum size: 10 MB.
- Display inline error messages for invalid files.

### 3. AI Crop Suggestion Algorithm
- Create a utility function `calculateAICrop(imageWidth, imageHeight, aspectRatio)`.
- The heuristic will calculate a standard headshot aspect ratio (e.g., 3:4 or 4:5).
- Place the crop box centered horizontally and positioned in the upper-center third vertically (where a face is most likely located).

### 4. Interactive Crop Editor
- Create a `CropEditor` component.
- Display the uploaded image with the AI-suggested crop box initialized.
- Use `react-image-crop` to render a visually distinct overlay (semi-transparent shading outside, clear bounding box).
- Enable free dragging, repositioning, and corner/edge resizing.
- Implement UI Controls:
  - **Reset to AI Suggestion**: Snaps crop back to the `calculateAICrop` result.
  - **Aspect Ratio Toggles**: Buttons to switch between 1:1, 3:4, 4:5, and Free form.

### 5. Export Functionality
- Implement a canvas-based client-side cropping function `exportCroppedImage(image, cropConfig)`.
- Draw the cropped portion onto a hidden HTML `<canvas>`.
- Convert the canvas to a Blob (JPEG or PNG).
- Trigger an automatic browser download.
- Show a success toast notification.

### 6. Polish (Non-Functional Requirements)
- Make the layout fully responsive for desktop and tablet screens.
- Add ARIA labels and ensure keyboard navigability for accessibility.
- Ensure performant 60fps rendering for interactions.

## Verification Plan

### Automated Tests
- Run `npm run lint` and `npm run build` to ensure there are no build or typing errors.

### Manual Verification
- Test uploading valid and invalid images.
- Verify the AI suggestion heuristic visually.
- Interactively resize, drag, and change aspect ratios in the editor.
- Click "Export Cropped Image" and verify the downloaded output matches the crop region.
- Test responsiveness in mobile/tablet views in the browser.
