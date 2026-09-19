const fs = require('fs');
const lines = fs.readFileSync('C:/Users/Ivan/.gemini/antigravity-ide/brain/4491a27e-8287-46d8-90e9-eef5c08975e2/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');
for (let i = lines.length - 1; i >= 0; i--) {
  const line = lines[i];
  if (line.includes('clock_drag') && line.includes('targetHour') && line.includes('targetMinute')) {
    const parsed = JSON.parse(line);
    if (parsed.step_index < 3000) {
      console.log("Step", parsed.step_index);
      const str = JSON.stringify(parsed);
      const idx = str.indexOf('Q001');
      if (idx !== -1) {
        console.log(str.slice(idx, idx + 1500));
        break;
      }
    }
  }
}
