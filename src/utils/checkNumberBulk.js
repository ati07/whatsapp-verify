const puppeteer = require("puppeteer");
var fs = require('fs');
async function checkNumberBulk(phoneNumbers) {
	const browser = await puppeteer.launch({
		headless: false,
		userDataDir: "./profileData",
	});

	const results = [];
	for (let i in phoneNumbers) {
		console.log('ph',i)
		const phoneNumber = phoneNumbers[i];
		const page = await browser.newPage();
		await page.setUserAgent(
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
		); // To Make sure Mobile version of Whatsapp Web doesn't load, fixes headless issue
		await page.setDefaultNavigationTimeout(0);
		await page.goto(
			`https://web.whatsapp.com/send?phone=${phoneNumber}&text&app_absent=0`,
			{ waitUntil: "networkidle0" }
		);
		await Promise.all([
			page.waitForNavigation({ waitUntil: "networkidle2" })
			// page.click(`#registrationSubmit`)
		])
		// await page.waitForNavigation({
		// 	waitUntil: "networkidle2",
		// });
		await new Promise(r => setTimeout(r, 10000)); // Wait for page load - added for cases where networkidle doesn't
		let numberExists = false;
		if ((await page.$("#main")) !== null) numberExists = true;
		results.push({
			phoneNumber,
			exists: numberExists,
		});
		await page.close();
	}

	await browser.close();
	console.log('re',results)
	return results;
}

const  readTxtFile = async() => {
	fs.readFile('phone_numbers.txt', 'utf8', async (error, data) => {
		if (error) {
			console.error('An error occurred while reading the file:', error);
			return;
		}
		console.log('File content:', data.split('\n'));
		let detail = data.split('\n')

		// detail.map(async(d)=>{
		//   await main(d.replace(/(\r\n|\n|\r)/gm, ""))
		// })
		for (let i = 0; i < detail.length; i++) {
			await checkNumberBulk(detail[i].replace(/(\r\n|\n|\r)/gm, ""))
		}
	})
}


// module.exports = checkNumberBulk;
module.exports = readTxtFile
