const constants = {
    cli: {
        clear: '\u001B[2J\u001B[0;0f'
    }
};

const storage = require('./storage');
const commands = ['put', 'get', 'update', 'save', 'clear', 'load'];
const cli = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

cli.start = function(restart = false) {
    if (!restart) {
        storage.load();
        process.stdout.write(constants.cli.clear);
    }

    console.log('Type /help to see available commands');

    this.question('Storage: ', commandInput => {
        switch(commandInput) {
            case '/exit':
                process.stdout.write(constants.cli.clear);

                this.question('Do you want to save the storage before to exit? (y/n)', exitAnswer => {
                    process.stdout.write(constants.cli.clear);
                  
                    if (exitAnswer === 'y' || exitAnswer === 'yes') {
                        console.log('Storage saved!');
                        
                        storage.save();
                    }
                    
                    console.log('Catch you later!');
                    this.close();
                });

                break;
            case '/help':
                process.stdout.write(constants.cli.clear);
                console.log(`Available commands: ${commands.join(', ')}`);
                
                this.start(true);
                break;
            case 'clear':
            case 'save':
            case 'load':
                storage[commandInput]();
                process.stdout.write(constants.cli.clear);
                console.log(`${commandInput} done!`);

                this.start(true);
                break;
            default:
                if (commands.filter(command => command == commandInput).length) {
                    this.question(`${commandInput} (Separate params by comma ex: param1, pram2):`, commandParams => {
                        inputParams = commandParams.split(',');
                        process.stdout.write(constants.cli.clear);

                        try {
                            let data = '';

                            if (inputParams[1]) {
                                data = storage[commandInput](inputParams[0], inputParams[1]);                        
                            } else {
                                data = storage[commandInput](inputParams[0]);                        
                            }

                            console.log(`${commandInput} done!`)

                            if (data) {
                                console.log(`result: ${data}`);
                            }
                        } catch(err) {
                            console.log(err.message);
                        }

                        this.start(true);
                    });
                } else {
                    process.stdout.write(constants.cli.clear);
                    console.log('Invalid command');

                    this.start(true);
                }
        }
    });
}

module.exports = cli;