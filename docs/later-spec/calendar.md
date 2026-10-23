# Module Spec — Calendar, Feed Planner & Best Time to Post

## 1. Layout Structure
- **Left Dock (`MediaSideBin`, 280px collapsible)**: Displays unscheduled media assets with quick filter tabs (`Unused`, `Starred`, `All`) and tag search. Clicking **"Schedule"** on any tile opens the Composer pre-attached with that asset.
- **Top Calendar Toolbar**:
  - Multi-profile selector pills (`Instagram`, `TikTok`, `Pinterest`, `LinkedIn`).
  - View mode switcher: `Week` | `Month` | `Visual Grid` | `Best Times Heatmap`.
  - Date navigation (`Prev`, `Today`, `Next`) + **"Quick Schedule Next Slot"** action.
- **Main Calendar Matrix**:
  - **Week View**: 7 day columns × 24 hourly rows (focused on active hours 07:00–21:00). Highlights **Best Time to Post** slots in subtle tinted emerald/blue cells with engagement score percentages (`tabular-nums`).
  - **Month View**: 35-cell month grid showing compact post strips per day with platform indicator, time, and status label.
  - **Visual Grid Preview**: 3-column Instagram/TikTok feed simulator allowing drag-and-drop or up/down slot swapping of scheduled posts before they publish.

## 2. Component States
- **Empty Slot Hover**: Displays `+ Schedule at {time}` affordance button.
- **Post Card States**:
  - `DRAFT`: Dashed hairline border, muted slate label, editable time.
  - `SCHEDULED`: Solid 1px border, platform handle, `Auto-Publish` indicator.
  - `PUBLISHED`: Subtle emerald status label + live engagement counter.
  - `FAILED`: Crimson alert label + 1-click **"Retry in Queue"** button.
