# Project Documentation: Datatable Tasks - Intern Selopia

## Project Overview

This project is a React-based application that demonstrates various datatable functionalities, including nested data handling, dynamic calculations, and conditional rendering. It addresses six distinct problems, each focusing on different aspects of data manipulation and visualization.

## Requirements Breakdown

### Problem 1: Inventory Management

- **Features**:
  - Display products with expandable variants.
  - Show stock status with warnings for low stock.
  - Include review stars and restock actions.

### Problem 2: Organization Structure

- **Features**:
  - Hierarchical display of departments, teams, and members.
  - Budget utilization progress bars.
  - Filtering by skills and project status.

### Problem 3: Academic Records

- **Features**:
  - Course listings with enrollment status and prerequisites.
  - Waitlist functionality for full courses.
  - Filtering by department and course status.

### Problem 4: Portfolio Management

- **Features**:
  - Calculates cost basis, realized/unrealized P/L.
  - Color-coded returns based on benchmarks.
  - High conviction filter.

### Problem 5: Warehouse Orders

- **Features**:
  - Calculates order totals with discounts and taxes.
  - Conditional formatting for low inventory.
  - Bulk discounts for large orders.

### Problem 6: Factory Production

- **Features**:
  - Calculates material requirements and production costs.
  - Reorder alerts based on lead time.
  - Color-coded material status.

## Code Structure

- **`src/Pages/`**: Contains components for each problem.
- **`public/demo/data/`**: Stores JSON data files for each problem.
- **`src/Router/`**: Defines routes for each page.
- **`src/layout/`**: Includes shared components like the app menu.

## Key Features

- **Row Expansion**: Nested data is displayed using expandable rows.
- **Dynamic Calculations**: Real-time updates based on user interactions.
- **Conditional Styling**: Visual cues for status, stock levels, etc.
- **Custom Filters**: Global and column-specific filters.

## Data Flow

1. **Fetch Data**: Each page fetches data from a JSON file.
2. **Process Data**: Calculations and transformations are applied.
3. **Render UI**: Data is displayed in tables with expandable sections.
4. **User Interactions**: Filters, sorting, and actions update the UI.

## Usage Instructions

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Run the app: `npm start`.
4. Navigate to different pages via the app menu.

## API Endpoints (Mock Data)

- **Problem 1**: `/demo/data/dataProblemOne.json`
- **Problem 2**: `/demo/data/dataProblemTwo.json`
- **Problem 3**: `/demo/data/dataProblemThree.json`
- **Problem 4**: `/demo/data/dataProblemFour.json`
- **Problem 5**: `/demo/data/dataProblemFive.json`
- **Problem 6**: `/demo/data/dataProblemSix.json`

## Custom Components

- **`AppMenu`**: Dynamic menu based on the current route.
- **`DataTable`**: Customized tables with expandable rows and filters.
- **`ProgressBar`**: Visual indicators for progress and utilization.

## Styling and Theming

- Uses PrimeReact components for a consistent UI.
- Custom CSS for conditional styling and responsive design.
