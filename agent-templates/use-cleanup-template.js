#!/usr/bin/env node

/**
 * Periodic Cleanup Agent Template Generator
 * 
 * Usage:
 *   node use-cleanup-template.js [focus-areas]
 * 
 * Example:
 *   node use-cleanup-template.js "CSS consolidation, JavaScript refactoring"
 */

const fs = require('fs');
const path = require('path');

// Default configuration
const DEFAULT_CONFIG = {
    PROJECT_NAME: 'Bosser',
    PROJECT_PATH: '/Users/anttitevanlinna/Projects/bosser',
    FOCUS_AREAS: 'General code cleanup and modernization'
};

function generateCleanupPrompt(focusAreas = null) {
    const templatePath = path.join(__dirname, 'periodic-cleanup-template.md');
    
    if (!fs.existsSync(templatePath)) {
        console.error('❌ Template file not found:', templatePath);
        process.exit(1);
    }
    
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Replace template variables
    const config = {
        ...DEFAULT_CONFIG,
        FOCUS_AREAS: focusAreas || DEFAULT_CONFIG.FOCUS_AREAS
    };
    
    Object.entries(config).forEach(([key, value]) => {
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        template = template.replace(regex, value);
    });
    
    return template;
}

function main() {
    const focusAreas = process.argv[2];
    
    console.log('🧹 Generating Periodic Cleanup Agent Prompt...\n');
    
    const prompt = generateCleanupPrompt(focusAreas);
    
    console.log('📋 Copy this prompt to use with the Task tool:\n');
    console.log('=' .repeat(80));
    console.log(prompt);
    console.log('=' .repeat(80));
    
    console.log('\n✅ Prompt generated successfully!');
    console.log('\n💡 Usage tips:');
    console.log('   1. Copy the prompt above');
    console.log('   2. Use it with: Task tool → subagent_type: "general-purpose"');
    console.log('   3. Review agent output before applying changes');
    console.log('   4. Run periodically for continuous code improvement');
    
    if (focusAreas) {
        console.log(`\n🎯 Focus areas: ${focusAreas}`);
    }
}

if (require.main === module) {
    main();
}

module.exports = { generateCleanupPrompt };