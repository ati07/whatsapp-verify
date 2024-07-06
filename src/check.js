const chalk = require("chalk");
const log = console.log;
const checkNumber = require("./utils/checkNumber");
var fs = require('fs');

(async () => {
	fs.readFile('phone_numbers.txt', 'utf8', async (error, data) => {
		if (error) {
			console.error('An error occurred while reading the file:', error);
			return;
		}
		console.log('File content:', data.split('\n'));
		let detail = data.split('\n')

		for (let i = 0; i < detail.length; i++) {
			let phoneNumber = detail[i].replace(/(\r\n|\n|\r)/gm, "")
			// await checkNumberBulk(detail[i].replace(/(\r\n|\n|\r)/gm, ""))
			log(chalk.blue(`Checking for Existence : ${phoneNumber}`));
			const numberExists = await checkNumber(phoneNumber);

			if (numberExists === 'Network Issue') {
				// issueResults.push([phoneNumber, 'Network Issue'])
				fs.appendFile('NetworkIssue.txt', `${phoneNumber}\n`, 'utf8', (error) => {
					if (error) {
						console.error('An error occurred while writing to the file:', error);
						return;
					}
					// console.log('Network Issue File has been written successfully.');
				});
			} else {
				// console.log('status', [phoneNumber, numberExists ? 'valid' : 'invalid'])
				// results.push([phoneNumber, numberExists ? 'valid' : 'invalid'])

				if (numberExists) {
					log(chalk.green.bold("Number Exists on Whatsapp"));
					fs.appendFile('valid.txt', `${phoneNumber}\n`, 'utf8', (error) => {
						if (error) {
							console.error('An error occurred while writing valid to the file:', error);
							return;
						}
						// console.log(' valid File has been written successfully.');
					});
				} else {
					log(chalk.red.bold("Number doesn't exist on Whatsapp"));
					fs.appendFile('invalid.txt', `${phoneNumber}\n`, 'utf8', (error) => {
						if (error) {
							console.error('An error occurred while writing invalid to the file:', error);
							return;
						}
						// console.log('invalid File has been written successfully.');
					});
				}

			}
			// remove number from file
			fs.readFile('phone_numbers.txt', 'utf8', function (err, data) {
				if (err) {
					// check and handle err
					console.error('An error occurred while reading numbers file:', error);
					return;
				}
				let newData = data.split('\n')
				newData.splice(0, 1);
				let lengthnewData = newData.length
				let lengthData = detail.length
				console.log("progress-----", ((1 - (lengthnewData / lengthData)) * 100).toFixed(2) + '%')
				// console.log()
				var linesExceptFirst = newData.join('\n');
				// console.log('linesExceptFirst',linesExceptFirst)
				fs.writeFile('phone_numbers.txt', linesExceptFirst, function (err, data) {
					if (error) {
						console.error('An error occurred while writing to the file:', error);
						return;
					}
					// console.log('phone_number File has been written successfully.'); 
				});
			});

		}


	})

})();
