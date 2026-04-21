const fs = require('fs');
const glob = require('glob');

const files = [
  'components/AgroCalendar.tsx',
  'components/InvestorPortal.tsx',
  'components/Channelling.tsx',
  'components/NetworkView.tsx',
  'components/TQMGrid.tsx',
  'components/ChromaSystem.tsx',
  'components/EmergencyPortal.tsx',
  'components/EnvirosAgroStore.tsx',
  'components/UserProfile.tsx',
  'components/AgroMultimediaGenerator.tsx',
  'components/DigitalMRV.tsx',
  'components/ResearchInnovation.tsx',
  'components/MediaLedger.tsx',
  'components/Intelligence.tsx',
  'components/MediaHub.tsx',
  'components/AgroValueEnhancement.tsx',
  'components/RobotSync.tsx',
  'components/CircularGrid.tsx',
  'components/Permaculture.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes('setActiveTab') && !content.includes(' SectionTabs ')) {
    console.log('Needs refactoring: ' + file);
  }
});
