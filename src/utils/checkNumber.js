const puppeteer = require("puppeteer");

async function checkNumber(phoneNumber) {
	try{
		const browser = await puppeteer.launch({
			headless: true,
			userDataDir: "./profileData",
		});
		const page = await browser.newPage();
		await page.setUserAgent(
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
		); // To Make sure Mobile version of Whatsapp Web doesn't load, fixes headless issue
		try{
			await page.goto(
				`https://web.whatsapp.com/send?phone=${phoneNumber}&text&app_absent=0`,
				{ waitUntil: "networkidle0" }
				// { waitUntil: 'load' }
			);
			// await Promise.all([
			// 	page.waitForNavigation({waitUntil: "networkidle2"})
			// 	// page.click(`#registrationSubmit`)
			//   ])
			try {
				// await page.waitForNavigation({
				// 	waitUntil: "load",
				// });side
				await page.waitForSelector('#side');
				await new Promise(r => setTimeout(r, 1000)); // Wait for page load - added for cases where networkidle doesn't
				let numberExists = false;
				try {
					await page.waitForSelector('#main');
					if ((await page.$("#main")) !== null) numberExists = true;
					await browser.close();
					return numberExists;
				} catch (errmain) {
					// console.log('errmain', errmain)
					await browser.close();
					return false;
				}
		
			} catch (err) {
				// console.log('err', err)
				await browser.close();
				return 'Network Issue';
			}
		}catch(pageloaderr){
			await browser.close();
			// console.log('pageloaderr',pageloaderr)
			return 'Network Issue';
		}
	}catch(errorLaunch){
		// await browser.close();
		// console.log('pageloaderr',pageloaderr)
		return 'Network Issue';
	}
	
	


}

module.exports = checkNumber;
