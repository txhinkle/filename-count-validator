const fs = require('node:fs');
// copy and paste the file name, including extention into the quotes below
const filename = 'EREP_MEMBER_ELIGIBILITY_IN_REALTIME_11302025_1764353969088_T.txt'
// Enter the name of the interface the file is for- e.g. 911
const fileType = '911'
const dateString = new Date(Date.now()).toLocaleString().split(',')[0];
const dateArray = dateString.split('/');
dateArray[0] = dateArray[0].length < 2 ? '0' + dateArray[0] : dateArray[0];
dateArray[1] = dateArray[1].length < 2 ? '0' + dateArray[1] : dateArray[1];
const date = dateArray[0] + dateArray[1] + dateArray[2];

const regexObject = {
    911: new RegExp("EREP\_MEMBER\_ELIGIBILITY\_IN\_REALTIME\_" + date + "\_[0-9 A-Z a-z]*\_T\.txt"),
    934: new RegExp("EREP\_MEMBER\_ELIGIBILITY\_IN\_BATCH\_" + date + "\_[0-9 A-Z a-z]*\_T\.txt"),
    1501: new RegExp('ORSIS\_TPL\_INFO\_IN\_' + date + '_[0-9]{4}_TEST\.xml'),
    424: new RegExp('PURCHASED\_DHS\_SERVICES\_CLAIMS\_FROM\_CAPS\_IN\_' + date + '\_T\.txt'),
}

if(regexObject[fileType].test(filename)) {
    console.log('Filename passes');
} else {
    console.log('Error in filename');
    if(fileType === '911' && filename.substring(36, 44) !== dateString) {
        console.log('incorrect date');
    }
}
let count = 0;

if(fileType === '911' || fileType === '934') {
    fs.readFile('./' + filename, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        } else {
            contents = data.split('\n');
            let recordCount = 0;
            contents.forEach((line) => {
                if(line.includes('</Eligibility>')) {
                    count++;
                }
                if(line.includes('<TotalEligibilityRecords>')) {
                    const start = line.indexOf('>') + 1;
                    const end = line.indexOf('</');
                    recordCount = line.substring(start, end) * 1;
                }
            })
            if (recordCount === count) {
                console.log('record count is correct');
            } else {
                console.log('There are ' + count + ' eligibility records in the file but the Trailer count reads ' + recordCount);
            }
            
        }
    })
}

