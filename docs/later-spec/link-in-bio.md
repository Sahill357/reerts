# Module Spec — Link in Bio Storefront Builder

## 1. Layout Structure
- **Left Pane (Configuration & Blocks)**:
  - **Profile Header**: Avatar, Display Title, Bio Description, Public Handle (`/bio/ateliervance`), Shareable URL copy button, and **"Open Public Bio Page"** preview toggle.
  - **Featured Banner Block**: Optional spotlight banner with headline, subcopy, CTA label, and destination link.
  - **Custom Action Buttons**: Reorderable list of links (e.g., *Autumn Kiln Collection*, *Studio Workshop Booking*, *Wholesale Catalog PDF*), click count telemetry (`tabular-nums`), active toggle, and delete/add controls.
  - **Shoppable Social Grid Mapping**: Automatically mirrors published/scheduled posts that include a `linkInBioUrl`, allowing editors to add, edit, or clear destination URLs on any post tile.
  - **Theme & Token Customizer**: Preset palettes (`Warm Alabaster`, `Obsidian Studio`, `Botanical Sage`, `Cobalt Editorial`) and button corner radius selector.
- **Right Pane (Interactive Device Preview)**:
  - Live interactive preview of the public Link-in-Bio page with working link clicks that increment real click attribution counters in the database.
