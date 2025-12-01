# iOS Customer Job Management App

A React Native mobile application for managing customers, jobs, and reports with bilingual support.

## What I have done

- custom hooks
- customers linked to their jobs
- language translations should work in all pages
- settings screen (edit profile, change language, view data stats, clear data)
- search and filtering
- dashboard with live data counts

## I am still working on

- maps integration showing customer locations with directions button
- finishing maps
- HIG documentation
- final testing

## Human Interface Guidelines Implementation

### Tab Bar Navigation

the app uses a standard ios tab bar at the bottom with 60pt height and 4 tabs (dashboard, customers, jobs, reports) to avoid overflow tabs that hig warns make content harder to reach. each tab has a 24pt icon with a 10pt label below it. active tabs are ios blue (#007AFF) and inactive tabs are gray (#8E8E93). following hig, no tabs are disabled, the jobs tab shows a placeholder explaining it's under development instead of being hidden, keeping the interface stable and predictable.

### Text Field Design

all forms follow apple's text field guidelines with placeholder text that disappears when typing. fields are stacked vertically with 15-20pt spacing for a clean organized layout. the app shows appropriate keyboards for each field like email keyboard for emails, phone pad for phone numbers, default for text, which hig says reduces typing errors. all fields exceed the 44x44pt minimum touch target with extra padding.

## Screens

1. **Dashboard**
2. **Customers**
3. **Customer Details**
4. **Add Customer**
5. **Jobs** - new
6. **Add/Edit Job** - new
7. **Job Details** - new
8. **Reports**
9. **Add Report**
10. **Report Details**
11. **Settings** - new

## External Packages Used

- **`@expo/vector-icons`** - app icons
- **`expo-status-bar`** - status bar control
- **`expo-haptics`** - tactile feedback
- **`@react-native-async-storage/async-storage`** - local data storage
- **`react-native-maps`** - map integration
- **`expo-router`** - navigation
- **`expo-image-picker`** - camera/photo access
