# Periodic Cleanup Agent Template

## Task: Periodic Code Maintenance and Refactoring
**Project**: {PROJECT_NAME}  
**Target Path**: {PROJECT_PATH}  
**Focus Areas**: {FOCUS_AREAS}

---

## 🎯 **Primary Objectives**

Perform incremental code maintenance focusing on:
- **DRY Principle** - Eliminate code duplication
- **Maintainability** - Improve code readability and organization  
- **Reliability** - Identify potential error sources
- **Modern Best Practices** - Update outdated patterns
- **Performance** - Small optimizations without breaking changes

---

## 📋 **Cleanup Checklist**

### **1. Code Duplication (DRY Principle)**
- [ ] Identify duplicate CSS rules/selectors
- [ ] Find repeated JavaScript functions/logic
- [ ] Consolidate similar HTML patterns
- [ ] Extract common utilities into reusable functions
- [ ] Look for copy-pasted code blocks

### **2. Modern Web Development Practices**
- [ ] Update deprecated HTML attributes
- [ ] Modernize CSS (flexbox/grid over floats)
- [ ] Use modern JavaScript features (const/let over var)
- [ ] Implement proper semantic HTML
- [ ] Check for accessibility improvements
- [ ] Validate CSS for modern browser support

### **3. Code Organization & Maintainability**
- [ ] Improve function/variable naming conventions
- [ ] Add JSDoc comments for complex functions
- [ ] Break down overly large functions (>50 lines)
- [ ] Organize CSS logically (base → components → utilities)
- [ ] Group related JavaScript methods
- [ ] Remove unused code/dead imports

### **4. Reliability & Error Prevention**
- [ ] Add null/undefined checks where needed
- [ ] Validate user inputs and API responses
- [ ] Check for potential race conditions
- [ ] Identify missing error handling
- [ ] Look for hardcoded values that should be constants
- [ ] Find potential memory leaks (event listeners, timers)

### **5. Performance Optimizations**
- [ ] Remove unused CSS rules
- [ ] Optimize selector specificity
- [ ] Check for inefficient DOM queries
- [ ] Look for unnecessary re-renders/calculations
- [ ] Identify large functions that could be split
- [ ] Check for missing debouncing on user inputs

---

## 🚫 **STRICT CONSTRAINTS**

### **DO NOT CHANGE:**
- Any existing functionality or user experience
- Visual design, animations, or styling effects
- API endpoints or data structures
- File structure or naming conventions
- Configuration files or build processes

### **DO NOT INTRODUCE:**
- New dependencies or frameworks
- Breaking changes to existing APIs
- Changes that require environment setup
- Major architectural modifications

---

## 📊 **Required Output Format**

Please provide a structured report with:

### **1. Executive Summary**
- Total issues found: `{number}`
- Critical issues: `{number}`
- Changes made: `{number}`
- Recommendations: `{number}`

### **2. Changes Made**
For each change, provide:
```
**File**: {filename}
**Type**: {DRY/Modernization/Organization/Reliability/Performance}
**Description**: {what was changed}
**Before**: {code snippet}
**After**: {code snippet}
**Impact**: {why this improves the code}
```

### **3. Issues Flagged (No Changes Made)**
```
**File**: {filename}
**Issue Type**: {Potential Bug/Performance/Security/Maintainability}
**Description**: {what the issue is}
**Location**: {line numbers or code snippet}
**Risk Level**: {Low/Medium/High}
**Recommendation**: {suggested fix}
```

### **4. Recommendations for Future**
- Architectural improvements to consider
- Tools that could help (linters, formatters)
- Patterns to adopt going forward
- Areas that need attention in next cleanup cycle

---

## 🎯 **File Scope**

### **Primary Targets**:
- `{PROJECT_PATH}/docs/index.html` - Main HTML structure
- `{PROJECT_PATH}/docs/js/*.js` - JavaScript functionality  
- `{PROJECT_PATH}/docs/styles.css` - Shared stylesheets
- `{PROJECT_PATH}/docs/articles/*.html` - Article templates

### **Secondary Targets**:
- `{PROJECT_PATH}/scripts/*.js` - Build/utility scripts
- `{PROJECT_PATH}/data/*.json` - Data files structure
- `{PROJECT_PATH}/*.md` - Documentation files

---

## 💡 **Modern Web Development Standards**

Apply these current best practices:

### **HTML5**
- Use semantic elements (`<main>`, `<section>`, `<article>`)
- Proper ARIA attributes for accessibility
- Meaningful alt texts and labels

### **Modern CSS**
- CSS Grid and Flexbox for layouts
- Custom properties (CSS variables) for theming
- Modern units (rem, vh/vw) over px where appropriate
- Mobile-first responsive design

### **Modern JavaScript (ES6+)**
- Arrow functions for callbacks
- Template literals over string concatenation
- Destructuring for cleaner code
- Async/await over Promises where readable
- const/let over var

### **Performance**
- Minimal DOM queries and manipulation
- Event delegation over individual listeners
- CSS animations over JavaScript where possible
- Lazy loading for large content

---

## 🔍 **Quality Metrics to Improve**

Track these improvements:
- Lines of duplicate code eliminated
- Function complexity reduced (cyclomatic complexity)
- Number of magic numbers replaced with constants
- Console warnings/errors eliminated
- Accessibility score improvements
- Performance metrics (load time, render time)

---

## 📝 **Usage Instructions**

1. **Replace template variables**:
   - `{PROJECT_NAME}` → "Bosser"
   - `{PROJECT_PATH}` → "/Users/anttitevanlinna/Projects/bosser"
   - `{FOCUS_AREAS}` → "JavaScript refactoring, CSS consolidation"

2. **Run the agent** with this template
3. **Review the output** carefully before applying changes
4. **Track progress** over multiple cleanup cycles
5. **Schedule regular cleanups** (weekly/monthly)

---

## 🚀 **Example Usage**

```
Task: Periodic Code Maintenance and Refactoring
Project: Bosser
Target Path: /Users/anttitevanlinna/Projects/bosser
Focus Areas: JavaScript event handling, CSS duplication, error handling

[Rest of template filled in...]
```

This template ensures consistent, safe, incremental improvements while maintaining all existing functionality and user experience.