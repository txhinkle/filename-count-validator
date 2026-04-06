const fs = require('node:fs');
const {open} = require('node:fs/promises');
// copy and paste the file name, including extention into the quotes below
const filename = ''
// Enter the name of the interface the file is for- e.g. 911
const fileType = '911'
const dateString = new Date(Date.now()).toLocaleString().split(',')[0];
const dateArray = dateString.split('/');
dateArray[0] = dateArray[0].length < 2 ? '0' + dateArray[0] : dateArray[0];
dateArray[1] = dateArray[1].length < 2 ? '0' + dateArray[1] : dateArray[1];
const date = dateArray[0] + dateArray[1] + dateArray[2];

const regexObject = {
    911: new RegExp("EREP\_MEMBER\_ELIGIBILITY\_IN\_REALTIME\_" + date + "\_[0-9 A-Z a-z]*\_T\.txt"),
    934: new RegExp("EREP\_MEMBER\_ELIGIBILITY\_IN\_BATCH\_" + date + '\_[0-9]' + "\_[0-9 A-Z a-z]*\_T\.txt"),
    1501: new RegExp('ORSIS\_TPL\_INFO\_IN\_' + date + '_[0-9]{4}_TEST\.xml'),
    424: new RegExp('PURCHASED\_DHS\_SERVICES\_CLAIMS\_FROM\_CAPS\_IN\_' + date + '\_T\.txt'),
}

if(regexObject[fileType].test(filename)) {
    console.log('Filename passes');
} else {
    console.log('Error in filename');
    if((fileType === '911' || fileType === '934') && filename.substring(36, 44) !== date) {
        console.log('incorrect date');
    }
}
let count = 0;
let totalCount = 0;

if(fileType === '911' || fileType === '934') {
    (async () => {
      const file = await open(`./${filename}`);
    
      for await (const line of file.readLines()) {
        if(line.includes('</Eligibility>')) {
            count++;
        } else if(line.includes('<TotalEligibilityRecords>')) {
                    const start = line.indexOf('>') + 1;
                    const end = line.indexOf('</');
                    totalCount = line.substring(start, end) * 1;
                }
      }
      console.log('count is ', count);
      console.log('trailer count is', totalCount);
      await file.close();
    })();
}