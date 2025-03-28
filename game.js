class Item {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    examine(game) {
        game.output(`Item: ${this.name}\n\n`);
        if (this.name === "Repair Manual") {
            game.output("A technical manual detailing station systems. Several pages are bookmarked:\n");
            game.output("CRITICAL SYSTEMS STATUS:\n");
            game.output("1. Life Support System", true);
            game.output("- Chemical imbalance detected in O2 recycling", true);
            game.output("- O2/N2 mixture: 17.3% (WARNING: Below safe threshold)", true);
            game.output("- Requires main computer for mixture calibration", true);
            game.output("\n2. Navigation System", true);
            game.output("- Position verification failure", true);
            game.output("- Stellar drift calculation error: -47.3 parsecs", true);
            game.output("- Main computer connection required for triangulation", true);
            game.output("\n3. Computer Core", true);
            game.output("- Primary systems offline", true);
            game.output("- Required for all critical system calibration", true);
            game.output("- Must be repaired first to enable other systems", true);
            game.output("\nWARNING: Attempting system repairs without main computer online may result in cascading failures.", false, "alert");
        } else if (this.name === "ASCII Table") {
            game.output(`Item: ${this.name}\n\n`);
            game.output("=== ASCII HEX REFERENCE ===\n\n");
            game.output("Hex  Char   |  Hex  Char   |  Hex  Char\n");
            game.output("----------------------------|----------\n");
            game.output("41   A      |  4D    M     |  59    Y\n");
            game.output("42   B      |  4E    N     |  5A    Z\n");
            game.output("43   C      |  4F    O     |  20   [space]\n");
            game.output("44   D      |  50    P     |  3A    :\n");
            game.output("45   E      |  51    Q     |  2D    -\n");
            game.output("46   F      |  52    R     |  2E    .\n");
            game.output("47   G      |  53    S     |  2C    ,\n");
            game.output("48   H      |  54    T     |  21    !\n");
            game.output("49   I      |  55    U     |  3F    ?\n");
            game.output("4A   J      |  56    V     |  28    (\n");
            game.output("4B   K      |  57    W     |  29    )\n");
            game.output("4C   L      |  58    X     |  27    '\n");
            game.output("\n61   a      |  6D    m     |  79    y\n");
            game.output("62   b      |  6E    n     |  7A    z\n");
            game.output("63   c      |  6F    o     |  \n");
            game.output("64   d      |  70    p     |  \n");
            game.output("65   e      |  71    q     |  \n");
            game.output("66   f      |  72    r     |  \n");
            game.output("67   g      |  73    s     |  \n");
            game.output("68   h      |  74    t     |  \n");
            game.output("69   i      |  75    u     |  \n");
            game.output("6A   j      |  76    v     |  \n");
            game.output("6B   k      |  77    w     |  \n");
            game.output("6C   l      |  78    x     |  \n");
        } else {
            game.output(`Item: ${this.name}\n\n`);
            game.output(this.description);
        }
    }
}

class Room {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.items = [];
    }
}

class Game {
    constructor() {
        this.MAX_INVENTORY = 7;
        this.rooms = [];
        this.inventory = [];
        this.currentRoom = 0;
        this.airlockDoorOpen = false;
        this.hasLight = false;
        this.actionCounter = 0;
        this.inMaintenance = false;
        this.obsdeckDoorUnlocked = false;
        this.DOOR_CODE = "9572";
        this.CONTROL_CODE = "1701";
        this.computerSystemFixed = false;
        this.navigationSystemFixed = false;
        this.lifeSupportFixed = false;
        this.roomFirstVisit = [];
        this.roomSearched = [];
        this.suitDamaged = false;
        this.commandsUntilDeath = 15;
        this.suitRepaired = false;
        this.messHallCounter = 0;
        this.messHallCounterStarted = false;
        this.hasGlowStickLight = false;
        this.blowTorchFueled = false;
        this.controlRoomDoorOpen = false;
        this.feelAroundUsed = false;

        this.initializeGame();
        this.setupEventListeners();
        this.setupModalHandlers();
    }

    initializeGame() {
        // Create rooms
        this.rooms.push(new Room("Airlock", "A pressurized chamber with heavy metal doors. A tool box sits in the corner."));
        this.rooms.push(new Room("Maintenance Corridor", "A long, dark narrow hallway."));
        this.rooms.push(new Room("Observation Deck", "Large windows show the vast expanse of space."));
        this.rooms.push(new Room("Mess Hall", "Tables and storage cabinets line the walls. Food trays are scattered about."));
        this.rooms.push(new Room("Control Room", "Banks of computers line the walls. Most screens are dark."));

        // Add items to rooms
        this.rooms[0].items.push(new Item("Crowbar", "A sturdy metal crowbar from the tool box. Could be useful for prying things open."));
        this.rooms[0].items.push(new Item("Duct Tape", "A roll of industrial strength duct tape. Universal repair tool."));
        this.rooms[0].items.push(new Item("Pressure Gauge", "A digital gauge showing dangerous fluctuations in the station's air pressure."));

        this.rooms[1].items.push(new Item("Glow Stick", "A bright emergency glow stick. Provides reliable light in dark areas."));
        this.rooms[1].items.push(new Item("Wire Cutters", "Heavy-duty cutting tool. Perfect for electrical repairs and wire management."));
        this.rooms[1].items.push(new Item("Repair Manual", "A worn technical manual detailing station maintenance procedures."));
        this.rooms[1].items.push(new Item("Sticky Note", `A crumpled yellow sticky note with hastily scrawled numbers. It reads: 'Observation Deck Security Code: ${this.DOOR_CODE}'`));

        this.rooms[2].items.push(new Item("Blow Torch", "A portable welding torch. Needs fuel to operate."));
        this.rooms[2].items.push(new Item("Star Chart", "A holographic display showing local star systems. Might help with navigation."));
        this.rooms[2].items.push(new Item("Telescope Lens", "A cracked lens from the observation equipment. Still usable as a focusing tool."));
        this.rooms[2].items.push(new Item("Radio", "A short-range communication device. No response on any emergency channels."));
        this.rooms[2].items.push(new Item("Circuit Board", "A replacement computer circuit board. Looks compatible with the main system."));

        this.rooms[3].items.push(new Item("Water Container", "An emergency water storage unit. Essential for survival in space."));
        this.rooms[3].items.push(new Item("First Aid Kit", "A well-stocked medical kit. Contains various supplies for emergencies."));
        this.rooms[3].items.push(new Item("Butane Canister", "A canister of butane fuel. Compatible with standard welding equipment."));
        this.rooms[3].items.push(new Item("9V Batteries", "A fresh pack of 9V batteries. Standard power source for emergency equipment."));
        this.rooms[3].items.push(new Item("Energy Bar", "A high-calorie emergency ration bar. Still within its expiration date."));

        this.rooms[4].items.push(new Item("ASCII Table", "A data pad containing station protocols and ASCII reference data."));
        this.rooms[4].items.push(new Item("Sticky Note", "A crumpled sticky note with hexadecimal numbers scrawled on it: '4F 56 45 52 52 49 44 45'"));

        // Start with headlight in inventory
        this.inventory.push(new Item("Headlight", "A battery-powered LED headlight. Essential for dark areas."));

        // Initialize room tracking arrays
        this.roomFirstVisit = new Array(this.rooms.length).fill(true);
        this.roomSearched = new Array(this.rooms.length).fill(false);

        // Show initial game message
        this.output("\n=== EMERGENCY ALERT ===\n\n");
        this.output("Multiple critical systems are down aboard the space station:", false);
        this.output("\n");
        this.output("- Life Support System: Critical Failure", false);
        this.output("- Navigation System: Offline", false);
        this.output("- Computer Systems: Malfunctioning", false);
        this.output("\n\n");

        this.output("Mission Objectives:", false);
        this.output("\n");
        this.output("1. Make your way through the space station to reach the Control Room", false);
        this.output("\n");
        this.output("2. Collect necessary tools and equipment", false);
        this.output("\n");
        this.output("3. Restore all critical systems (Navigation, Life Support, and Computer Systems)", false);
        this.output("\n\n");

        this.output("Press Enter to begin emergency protocols...", false);
    }

    setupEventListeners() {
        const input = document.getElementById('command-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                input.value = '';
                this.parseCommand(command);
            }
        });
    }

    setupModalHandlers() {
        const modal = document.getElementById('input-modal');
        const modalInput = document.getElementById('modal-input');
        const modalSubmit = document.getElementById('modal-submit');
        const modalCancel = document.getElementById('modal-cancel');

        modalSubmit.addEventListener('click', () => {
            const input = modalInput.value.trim();
            this.handleModalInput(input);
            this.hideModal();
        });

        modalCancel.addEventListener('click', () => {
            this.hideModal();
        });

        modalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const input = modalInput.value.trim();
                this.handleModalInput(input);
                this.hideModal();
            }
        });
    }

    showModal(title, message) {
        const modal = document.getElementById('input-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        const modalInput = document.getElementById('modal-input');

        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalInput.value = '';
        modal.style.display = 'flex';
        modalInput.focus();
    }

    hideModal() {
        const modal = document.getElementById('input-modal');
        const modalInput = document.getElementById('modal-input');
        modal.style.display = 'none';
        modalInput.value = '';
        document.getElementById('command-input').focus();
    }

    handleModalInput(input) {
        if (this.currentRoom === 1 && !this.obsdeckDoorUnlocked) {
            if (input === this.DOOR_CODE) {
                this.obsdeckDoorUnlocked = true;
                this.output("Access granted. The observation deck door unlocks with a soft click.", false);
            } else if (input === "0") {
                this.output("Access attempt cancelled.", false);
            } else {
                this.output("Access denied. The security terminal beeps angrily.", false);
            }
        }
        else if (this.currentRoom === 4 && !this.computerSystemFixed) {
            if (input === "OVERRIDE") {  // ASCII hex: 4F 56 45 52 52 49 44 45
                this.computerSystemFixed = true;
                this.output("Password accepted. The computer system begins to reboot.", false);
                this.output("\n");
                this.output("Main computer systems restored.", false);
                this.output("All critical systems are now accessible.", false);
            } else if (input === "0") {
                this.output("Access attempt cancelled.", false);
            } else {
                this.output("Invalid password. The system remains locked.", false);
            }
        }
    }

    output(text, indent = false, style = "normal") {
        const output = document.getElementById('output');
        const line = document.createElement('div');
        line.textContent = (indent ? "    " : "") + text;
        if (style === "alert") {
            line.classList.add('alert');
        } else if (style === "info") {
            line.classList.add('info');
        }
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    parseCommand(input) {
        // Convert input to lowercase for easier comparison
        const lowerInput = input.toLowerCase();

        // Show oxygen warning first and keep it visible
        if (this.suitDamaged && !this.suitRepaired) {
            this.commandsUntilDeath--;
            if (this.commandsUntilDeath <= 0) {
                this.output("Your suit's oxygen supply is depleted. The room begins to spin as you lose consciousness...", false);
                this.output("\n\nGame Over\n");
                return;
            } else {
                this.output(`WARNING: Suit oxygen leak active. Commands remaining: ${this.commandsUntilDeath}`, false, "alert");
                if (this.commandsUntilDeath <= 3) {
                    this.output("CRITICAL: Seal the leak immediately!", false, "alert");
                }
                this.output("\n");
            }
        }

        // Handle commands
        if (input === "M" || input === "Move" || 
            lowerInput === "go to next room" || 
            lowerInput === "open door" ||
            lowerInput === "go forward" ||
            lowerInput === "continue forward" ||
            lowerInput === "proceed" ||
            lowerInput === "go ahead" ||
            lowerInput === "next room" ||
            lowerInput.includes("move to") || 
            lowerInput.includes("go to")) {
            this.moveToNextRoom();
        }
        else if (lowerInput === "look around" ||
                 lowerInput === "check room" ||
                 lowerInput === "search room" ||
                 lowerInput === "examine room" ||
                 lowerInput === "scan room" ||
                 lowerInput === "inspect" ||
                 lowerInput === "investigate" ||
                 lowerInput === "s" ||
                 lowerInput === "search") {
            this.search();
        }
        else if (lowerInput === "g" || lowerInput === "grab" || lowerInput === "take" ||
                 lowerInput.includes("grab ") ||
                 lowerInput.includes("take ") ||
                 lowerInput.includes("pick up") ||
                 lowerInput.includes("take the") ||
                 lowerInput.includes("grab the") ||
                 lowerInput.includes("get the")) {
            this.takeItem(input);
        }
        else if (lowerInput === "e" || 
                 lowerInput === "examine" ||
                 lowerInput.includes("look at") ||
                 lowerInput.includes("check the") ||
                 lowerInput.includes("examine the") ||
                 lowerInput.includes("inspect the")) {
            this.examineItem(input);
        }
        else if (input === "m" || input === "map" || input === "Map" || 
                 lowerInput === "show map" || 
                 lowerInput === "display map" ||
                 lowerInput === "view map" ||
                 lowerInput === "check map" ||
                 lowerInput === "where am i") {
            this.showMap();
        }
        else if (lowerInput === "what can i do" ||
                 lowerInput === "show commands" ||
                 lowerInput === "show help" ||
                 lowerInput === "commands" ||
                 lowerInput === "options" ||
                 lowerInput === "help" ||
                 lowerInput === "h") {
            this.showHelp();
        }
        else if (input === "I" || input === "inv" || input === "inventory") {
            this.listInventory();
        }
        else if (lowerInput === "room info" || lowerInput === "info" || lowerInput === "i") {
            this.showRoomInfo();
        }
        else if (lowerInput === "feel around" || 
                 lowerInput === "feel" || 
                 lowerInput.includes("touch around") || 
                 lowerInput.includes("fumble around") ||
                 lowerInput.includes("grope around") ||
                 lowerInput.includes("reach around") ||
                 lowerInput.includes("search with hands") ||
                 lowerInput.includes("search by touch") ||
                 lowerInput.includes("search in dark") ||
                 lowerInput.includes("search blindly") ||
                 lowerInput.includes("feel in dark") ||
                 lowerInput.includes("feel your way") ||
                 lowerInput.includes("feel way around") ||
                 lowerInput.includes("use hands to search") ||
                 lowerInput.includes("search by feeling")) {
            this.feelAround();
        }
        else if (lowerInput === "u" || 
                 lowerInput === "use" || 
                 lowerInput.includes("use the") ||
                 lowerInput.includes("use ")) {
            this.useItem(input);
        }
        else if (lowerInput === "d" || 
                 lowerInput === "drop" ||
                 lowerInput.includes("drop ") ||
                 lowerInput.includes("drop the")) {
            this.dropItem(input);
        }
        else if (lowerInput === "q" || lowerInput === "quit") {
            this.output("Thanks for playing! Goodbye!");
            return;
        }
        else {
            this.output(`Unknown command '${lowerInput}'. Type 'help' for available commands.`);
        }
    }

    terminalEffect(text, delay = 30) {
        const output = document.getElementById('output');
        const line = document.createElement('div');
        line.classList.add('terminal-text');
        
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                line.textContent += text[i];
                i++;
            } else {
                clearInterval(interval);
                line.textContent += '\n';
            }
        }, delay / 1000);  // Convert microseconds to milliseconds
        
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    async getNumericInput(maxChoice) {
        return new Promise((resolve) => {
            const input = document.getElementById('command-input');
            const handler = (e) => {
                if (e.key === 'Enter') {
                    const value = parseInt(input.value.trim());
                    input.value = '';
                    
                    if (isNaN(value) || value < 0 || value > maxChoice) {
                        this.output(`Invalid input. Please enter a number between 0 and ${maxChoice}.`);
                        return;
                    }
                    
                    input.removeEventListener('keypress', handler);
                    resolve(value);
                }
            };
            
            input.addEventListener('keypress', handler);
        });
    }

    async moveToNextRoom() {
        if (this.currentRoom === 0) {  // In Airlock
            if (!this.airlockDoorOpen) {
                this.output("The airlock door is sealed tight. The emergency override appears to be malfunctioning.", false);
                this.output("\n");
                this.output("You'll need to find a way to force it open.", false);
                this.output("\n");
                return;
            }
            // If door is open, move directly to maintenance
            this.currentRoom = 1;
            this.output("Moving to the Maintenance Corridor...", true);
            this.output("\n");
            if (this.roomFirstVisit[this.currentRoom]) {
                this.output("The maintenance corridor stretches before you, a claustrophobic tunnel. Through your helmet's visor, you can see damaged electrical systems sparking in the darkness.", true);
                this.roomFirstVisit[this.currentRoom] = false;
            }
            this.feelAroundUsed = false;
            return;
        }

        if (this.currentRoom === 1) {  // Maintenance Corridor
            if (!this.obsdeckDoorUnlocked) {
                this.output("\n=== OBSERVATION DECK SECURITY TERMINAL ===");
                this.terminalEffect("Accessing security systems...");
                this.terminalEffect("Initiating authentication protocol...\n");
                
                this.showModal("Observation Deck Security", "Enter security code:");
                return;
            }
        }

        // Show available rooms
        this.output("Available rooms to move to:\n\n");
        
        let options = [];
        if (this.currentRoom > 0) {
            options.push(`Go back to ${this.rooms[this.currentRoom-1].name}`);
        }
        if (this.currentRoom < this.rooms.length - 1) {
            options.push(`Continue to ${this.rooms[this.currentRoom+1].name}`);
        }
        
        options.forEach((option, index) => {
            this.output(`${index + 1}. ${option}`);
        });
        
        this.output("\nEnter number (or 0 to cancel): ");
        
        const choice = await this.getNumericInput(options.length);
        if (choice === 0) return;

        // Handle room movement based on choice
        if (choice === 1 && this.currentRoom > 0) {
            this.currentRoom--;
            this.showRoomTransition('back');
        } else if (choice === 2 && this.currentRoom < this.rooms.length - 1) {
            this.currentRoom++;
            this.showRoomTransition('forward');
        }
    }

    search() {
        this.output(`\nYou are in the ${this.rooms[this.currentRoom].name}\n\n`);

        if (!this.hasLight && (this.currentRoom === 0 || this.currentRoom === 1)) {
            if (this.currentRoom === 0) {
                this.output("Darkness fills the airlock.", false);
                this.output("\n");
                this.output("The emergency lights have failed, leaving only the faint glow of distant stars through the small window.", false);
                this.output("\n");
            } else {
                this.output("The maintenance corridor is completely dark.", false);
                this.output("\n");
                this.output("You can hear the creaking of metal and the soft whoosh of air through the ventilation system.", false);
                this.output("\n");
            }

            // 50% chance to find random item in dark
            if (this.rooms[this.currentRoom].items.length > 0) {
                if (Math.random() < 0.5) {
                    const randomIndex = Math.floor(Math.random() * this.rooms[this.currentRoom].items.length);
                    const foundItem = this.rooms[this.currentRoom].items[randomIndex];
                    
                    if (this.inventory.length >= this.MAX_INVENTORY) {
                        this.output("You stumble upon something in the darkness, but your inventory is full!", false);
                        this.output("\n");
                    } else {
                        this.output("Despite the darkness, your hand brushes against something...", false);
                        this.output("\n");
                        this.inventory.push(foundItem);
                        this.rooms[this.currentRoom].items.splice(randomIndex, 1);
                        this.output("You found: " + foundItem.name, false);
                        this.output("\n");
                    }
                }
            }
            
            if (this.actionCounter >= 15) {
                this.output("Somewhere in the darkness ahead, you notice a faint green glow.", true, "info");
            }
            this.output("\n");
            return;
        }

        this.roomSearched[this.currentRoom] = true;

        if (this.rooms[this.currentRoom].items.length > 0) {
            this.output("After searching the room, you find:", false);
            this.output("\n");
            this.rooms[this.currentRoom].items.forEach((item, index) => {
                this.output(`${index + 1}. ${item.name}`, true);
            });
            this.output("\n");
        } else {
            this.output("You search the room but find no useful items.", true, "info");
            this.output("\n");
        }
        
        // Add special terminal notifications for each room
        if (this.currentRoom === 1) {
            this.output("You also notice:", false);
            this.output("\n");
            this.output("- An Observation Deck Security Terminal", true);
            this.output("- A Life Support System Access Terminal", true);
            this.output("\n");
        } 
        else if (this.currentRoom === 2) {
            this.output("You also notice:", false);
            this.output("\n");
            this.output("- A Navigation System Terminal", true);
            this.output("- A Mess Hall Security Terminal", true);
            this.output("\n");
        }
        else if (this.currentRoom === 4) {
            this.output("You also notice:", false);
            this.output("\n");
            this.output("- A Main Computer System Terminal", true);
            this.output("\n");
        }
        
        this.checkAndUpdateLight();
    }

    checkAndUpdateLight() {
        if (this.inMaintenance) {
            this.actionCounter++;
            if (this.actionCounter === 15) {
                this.output("\nYour headlight flickers and dies. The batteries are dead!\n");
                this.hasLight = false;
            }
        }
    }

    listInventory() {
        if (this.inventory.length === 0) {
            this.output("Your inventory is empty.", true, "info");
            return;
        }
        this.output(`Inventory (${this.inventory.length}/${this.MAX_INVENTORY} items):`, false);
        this.output("\n");
        this.inventory.forEach((item, index) => {
            this.output(`${index + 1}. ${item.name}`, true);
        });
    }

    takeItem(input) {
        // Check for light in dark rooms first
        if (!this.hasLight && (this.currentRoom === 0 || this.currentRoom === 1)) {
            this.output("The darkness makes it impossible to find anything. You'll need a light source first.", false, "alert");
            this.output("\n");
            return;
        }

        // If no item specified, show numbered list
        if (!input || input === "take" || input === "grab") {
            if (this.rooms[this.currentRoom].items.length === 0) {
                this.output("There are no items to take here.", false);
                return;
            }

            this.output("What do you want to grab?\n\n");
            this.rooms[this.currentRoom].items.forEach((item, index) => {
                this.output(`${index + 1}. ${item.name}`);
            });

            this.output("\nEnter number (or 0 to cancel): ");
            return;
        }

        // Handle taking by name
        if (this.inventory.length >= this.MAX_INVENTORY) {
            this.output("Your inventory is full! Drop something first.", false);
            return;
        }

        const itemName = input.split(" ").slice(1).join(" ").toLowerCase();
        const itemIndex = this.rooms[this.currentRoom].items.findIndex(item => 
            item.name.toLowerCase() === itemName
        );

        if (itemIndex !== -1) {
            if (this.rooms[this.currentRoom].items[itemIndex].name === "Pressure Gauge") {
                this.output("The pressure gauge is securely mounted to the wall.", false);
                return;
            }
            this.inventory.push(this.rooms[this.currentRoom].items[itemIndex]);
            this.output(`Grabbed: ${this.rooms[this.currentRoom].items[itemIndex].name}`, false);
            this.rooms[this.currentRoom].items.splice(itemIndex, 1);
        } else {
            this.output("You don't see that here.", false);
        }
    }

    examineItem(input) {
        // Special case for pressure gauge in airlock
        if (this.currentRoom === 0 && (input === "Pressure Gauge" || input === "gauge" || input === "pressure")) {
            this.output("\nThe digital display shows critical readings:", false);
            this.output("Main Hull: 68% nominal pressure", false);
            this.output("Deck 2: WARNING - Pressure dropping", false);
            this.output("Life Support: CRITICAL - System malfunction", false);
            this.output("The gauge's warning light pulses an angry red.", false);
            return;
        }

        // If no item specified, show numbered list
        if (!input || input === "examine") {
            if (this.inventory.length === 0) {
                this.output("You have nothing to examine.", false);
                return;
            }

            this.output("\nWhat would you like to examine?\n\n");
            this.inventory.forEach((item, index) => {
                this.output(`${index + 1}. ${item.name}`);
            });

            this.output("\nEnter number (or 0 to cancel): ");
            return;
        }

        // Handle examining by name
        const itemName = input.split(" ").slice(1).join(" ").toLowerCase();
        const item = this.inventory.find(item => item.name.toLowerCase() === itemName);
        
        if (item) {
            item.examine(this);
        } else {
            this.output("You don't have that item in your inventory.", false);
        }
    }

    showMap() {
        this.output("\n=== Station Layout & Mission Info ===\n\n");
        
        const map = [
            "   ╔══════════════╗",
            "   ║ Control Room ║",
            "   ╚══════╦═══════╝",
            "          ║      ",
            "    ╔═════╩═════╗",
            "    ║ Mess Hall ║",
            "    ╚═════╦═════╝",
            "          ║      ",
            " ╔════════╩═════════╗",
            " ║ Observation Deck ║",
            " ╚════════╦═════════╝",
            "          ║      ",
            "    ╔═════╩═════╗",
            "    ║  Corridor ║",
            "    ╚═════╦═════╝",
            "          ║      ",
            "    ╔═════╩═════╗",
            "    ║  Airlock  ║",
            "    ╚═══════════╝"
        ];

        // Show map with single centered arrow for current location
        for (let i = 0; i < map.length; i++) {
            if (i/2 === 8-this.currentRoom*2) {
                this.output("           " + map[i]);
                this.output("      -->  " + map[i+1]);
                i++;
            } else {
                this.output("           " + map[i]);
            }
        }

        this.output("\n=== Mission Objectives ===", false);
        this.output("\n");
        this.output("1. Make your way through the space station to reach the Control Room", true);
        this.output("2. Collect necessary repair tools and equipment", true);
        this.output("3. Restore all critical systems", true);
    }

    showHelp() {
        this.output("Available Commands:", false);
        this.output("\n");
        this.output("- search (s)", true);
        this.output("- view inventory (I)", true);
        this.output("- info (i, room info)", true);
        this.output("- grab [item] (g)", true);
        this.output("- examine [item] (e)", true);
        this.output("- use [item] (u)", true);
        this.output("- drop [item] (d)", true);
        this.output("- move rooms (M, Move, open door)", true);
        this.output("- show map/map (m)", true);
        this.output("- help (h)", true);
        this.output("- quit (q)", true);
    }

    showRoomInfo() {
        this.output(`\n=== ${this.rooms[this.currentRoom].name} Information ===\n\n`);
        
        switch(this.currentRoom) {
            case 0:
                this.output("The airlock serves as the primary entry and exit point for the station. The reinforced doors are designed to withstand extreme pressure differences.", false);
                this.output("\n");
                this.output("CAUTION: Emergency lighting systems are non-functional.", false, "alert");
                this.output("\n");
                break;
            case 1:
                this.output("The maintenance corridor houses the station's vital infrastructure. Power conduits and life support systems run through its walls.", false);
                this.output("\n");
                this.output("Engineering Note: Last scheduled maintenance was interrupted mid-task. Tools left behind suggest a hasty evacuation.", false, "info");
                this.output("\n");
                this.output("CAUTION: Unstable power fluctuations detected in primary conduits.", false, "alert");
                this.output("\n");
                break;
            case 2:
                this.output("The observation deck's reinforced windows provide a 180-degree view of space.", false);
                this.output("\n");
                this.output("Log Entry: Strange readings were reported by the night shift. Several instruments show impossible stellar configurations.", false, "info");
                this.output("\n");
                this.output("Status: Backup navigation systems are operational but reporting conflicting coordinates.", false, "alert");
                this.output("\n");
                break;
            case 3:
                this.output("The mess hall was designed for a crew of twelve. Food synthesizers and storage units line the walls.", false);
                this.output("\n");
                this.output("Personal Log: 'The coffee machine started making strange noises this morning. Then all hell broke loose.'", false, "info");
                this.output("\n");
                break;
            case 4:
                this.output("The control room is the brain of the station. All critical systems can be monitored and controlled from here.", false);
                this.output("\n");
                this.output("Final Log: 'Multiple system failures detected. Navigation errors increasing. Emergency protocols initiated.'", false, "info");
                this.output("\n");
                this.output("CRITICAL: Main computer core experiencing cascading failures.", false, "alert");
                this.output("\n");
                break;
        }
    }

    feelAround() {
        if (!this.hasLightSource() && !this.feelAroundUsed && this.rooms[this.currentRoom].items.length > 0) {
            // 50% chance to find an item
            if (Math.random() < 0.5) {
                const randomIndex = Math.floor(Math.random() * this.rooms[this.currentRoom].items.length);
                const foundItem = this.rooms[this.currentRoom].items[randomIndex];
                
                if (this.inventory.length >= this.MAX_INVENTORY) {
                    this.output("You found something in the darkness, but your inventory is full!", false);
                    this.output("\n");
                    return;
                }
                
                this.output("Feeling around in the darkness, your hand touches something...", false);
                this.output("\n");
                this.inventory.push(foundItem);
                this.rooms[this.currentRoom].items.splice(randomIndex, 1);
                this.output("You found: " + foundItem.name, false);
                this.output("\n");
            } else {
                this.output("You feel around in the darkness but find nothing useful.", false);
                this.output("\n");
            }
            this.feelAroundUsed = true;
        } else if (this.hasLightSource()) {
            this.output("You can see clearly with your light source. Try searching instead.", false);
            this.output("\n");
        } else if (this.feelAroundUsed) {
            this.output("You've already thoroughly felt around this area.", false);
            this.output("\n");
        } else {
            this.output("You feel around but find nothing.", false);
            this.output("\n");
        }
    }

    useItem(input) {
        if (!input || input === "use") {
            if (this.inventory.length === 0) {
                this.output("You have no items to use.", false);
                return;
            }
            
            this.output("Which item do you want to use?\n\n");
            this.inventory.forEach((item, index) => {
                this.output(`${index + 1}. ${item.name}`);
            });
            
            this.output("\nEnter number (or 0 to cancel): ");
            return;
        }

        const itemName = input.split(" ").slice(1).join(" ").toLowerCase();
        const item = this.inventory.find(item => item.name.toLowerCase() === itemName);
        
        if (!item) {
            this.output("You don't have that item.", false);
            return;
        }

        // Handle specific item usage
        switch(item.name) {
            case "Headlight":
                if (this.hasLight) {
                    this.output("The headlight is already on.", false);
                } else if (this.messHallCounterStarted) {
                    this.output("The headlight's batteries are dead.", false);
                } else {
                    this.hasLight = true;
                    this.output("You turn on the headlight. The area is illuminated!", false);
                }
                break;
            case "Radio":
                this.output("You activate the radio, but hear only static. The emergency channels are silent.", false);
                this.output("\n");
                this.output("After a moment, you catch what sounds like a distant signal, but it fades into white noise.", false);
                this.output("\n");
                break;
            case "Glow Stick":
                if (!this.hasLight) {
                    this.hasLight = true;
                    this.output("You crack the glow stick. A green light fills the area!", false);
                }
                break;
            case "Crowbar":
                if (this.currentRoom === 0) {
                    this.airlockDoorOpen = true;
                    this.output("You use the crowbar to pry open the airlock door.", false);
                }
                break;
            case "Duct Tape":
                if (this.suitDamaged && !this.suitRepaired) {
                    this.suitRepaired = true;
                    this.suitDamaged = false;
                    this.output("You quickly apply the duct tape to seal the tear in your suit. The oxygen leak stops.", false);
                    this.output("\n");
                    this.output("It's not pretty, but it'll hold.", false);
                }
                break;
            case "Wire Cutters":
                if (this.currentRoom === 1) {
                    this.output("You carefully cut and clear away the loose, sparking wires. The corridor seems a bit safer now.", false);
                    this.output("\n");
                } else {
                    this.output("There are no exposed wires that need cutting here.", false);
                    this.output("\n");
                }
                break;
            case "9V Batteries":
                if (!this.hasLight && this.messHallCounter >= 3) {
                    this.hasLight = true;
                    this.messHallCounter = 0;
                    this.output("You replace the dead batteries in your headlight. The beam springs back to life!", false);
                    this.output("\n");
                }
                break;
            case "Energy Bar":
                this.wrapText("You begin to remove your helmet to eat the energy bar...");
                this.wrapText("\nThe moment you break the helmet seal, warning lights flash on your suit display.", false, "alert");
                this.output("\nWhat would you like to do?\n");
                this.output("1. Continue removing helmet to eat the energy bar");
                this.output("2. Quickly reseal your helmet");
                this.output("\nEnter choice: ");
                
                // Handle the choice
                const handleEnergyBar = async () => {
                    const choice = await this.getNumericInput(2);
                    if (choice === 1) {
                        this.wrapText("As you remove your helmet, the vacuum of space rushes in. Everything goes dark...", false, "alert");
                        this.output("\nGame Over");
                        return;
                    } else if (choice === 2) {
                        this.wrapText("You quickly reseal your helmet. That was close!", false, "info");
                    }
                };
                handleEnergyBar();
                break;
            case "Blow Torch":
                if (this.currentRoom !== 3) {
                    this.output("There's nothing here that needs cutting.", false);
                    this.output("\n");
                } else {
                    const hasButane = this.inventory.some(item => item.name === "Butane Canister");
                    if (!hasButane) {
                        this.output("Needs fuel to work.", false);
                        this.output("\n");
                    } else {
                        this.controlRoomDoorOpen = true;
                        this.output("You attach the butane canister to the blow torch and cut through the control room door's emergency locks.", false);
                        this.output("\n");
                        this.output("The way to the control room is now clear.", false);
                        this.output("\n");
                        
                        // Remove butane canister after use
                        const butaneIndex = this.inventory.findIndex(item => item.name === "Butane Canister");
                        if (butaneIndex !== -1) {
                            this.inventory.splice(butaneIndex, 1);
                        }
                    }
                }
                break;
            default:
                this.output("You can't use that here.", false);
        }
    }

    dropItem(input) {
        if (!input || input === "drop") {
            if (this.inventory.length === 0) {
                this.output("You have no items to drop.", false);
                return;
            }

            this.output("What do you want to drop?\n\n");
            this.inventory.forEach((item, index) => {
                this.output(`${index + 1}. ${item.name}`);
            });
            
            this.output("\nEnter number (or 0 to cancel): ");
            return;
        }

        const itemName = input.split(" ").slice(1).join(" ").toLowerCase();
        const itemIndex = this.inventory.findIndex(item => item.name.toLowerCase() === itemName);
        
        if (itemIndex !== -1) {
            if (this.inventory[itemIndex].name === "Headlight" && !this.hasGlowStickLight && (this.currentRoom === 0 || this.currentRoom === 1)) {
                this.output("You can't drop your only light source in a dark area!", false, "alert");
                this.output("\n");
                return;
            }
            
            this.rooms[this.currentRoom].items.push(this.inventory[itemIndex]);
            this.output(`Dropped: ${this.inventory[itemIndex].name}`, false);
            this.inventory.splice(itemIndex, 1);
        } else {
            this.output("You don't have that item.", false);
        }
    }

    hasLightSource() {
        return this.hasLight || this.hasGlowStickLight;
    }

    examineSystem(systemName) {
        if (systemName === "computer" && this.currentRoom === 4) {
            this.output("The computer appears to be malfunctioning. It only displays ascii characters in hexadecimal format. You can try to access it.", false);
            this.output("\n\n");
            this.output("=== MAIN COMPUTER DIAGNOSTIC TERMINAL ===\n");
            
            if (!this.computerSystemFixed) {
                this.output("70 61 73 73 77 6F 72 64 3A", false);  // "Password:" in hex
                this.output("\n\n");
                this.showModal("Main Computer System", "Enter override password:");
            } else {
                this.output("The computer system is functioning normally.", true);
            }
        }
        else if (systemName === "navigation" && this.currentRoom === 2) {
            this.output("\n=== NAVIGATION SYSTEM TERMINAL ===\n");
            this.output("Accessing navigation controls...");
            this.output("Checking system status...\n");
            
            if (!this.computerSystemFixed) {
                this.output("ERROR: Cannot establish connection to main computer", false);
                this.output("Navigation system is locked out. Main computer must be repaired first.", false, "alert");
                this.output("\n");
            }
            else if (!this.navigationSystemFixed) {
                if (this.hasRequiredTools("navigation")) {
                    this.output("Initiating calibration sequence...");
                    this.output("Aligning stellar sensors...");
                    this.output("Updating star charts...");
                    this.output("You successfully calibrate and repair the navigation system.", false);
                    this.navigationSystemFixed = true;
                    this.output("Navigation systems restored");
                    this.output("Current Position: Sector 7, Quadrant 3");
                    this.output("All tracking systems: Online");
                    this.output("Course plotting: Available");
                } else {
                    this.output("The navigation system needs repairs. You'll need a Star Chart and Telescope Lens.", false, "info");
                }
            } else {
                this.output("Navigation systems operating normally");
                this.output("Current Position: Sector 7, Quadrant 3");
                this.output("All tracking systems: Online");
                this.output("Course plotting: Available");
            }
        }
        else if (systemName === "life support" && this.currentRoom === 1) {
            this.output("\n=== LIFE SUPPORT CONTROL TERMINAL ===\n");
            this.output("Accessing life support controls...");
            this.output("Checking system status...\n");
            
            if (!this.computerSystemFixed) {
                this.output("ERROR: Cannot establish connection to main computer", false);
                this.output("Life Support system is locked out. Main computer must be repaired first.", true, "alert");
            }
            else if (!this.lifeSupportFixed) {
                if (this.hasRequiredTools("life support")) {
                    this.output("Initiating repair sequence...");
                    this.output("Installing water filtration system...");
                    this.output("Connecting backup power...");
                    this.output("You manage to repair and stabilize the life support system.", true);
                    this.lifeSupportFixed = true;
                    this.output("Life support systems operating at optimal levels");
                    this.output("Oxygen levels: Normal");
                    this.output("Pressure: Stable");
                    this.output("Temperature: 21°C");
                } else {
                    this.output("The life support system requires repairs. You'll need a Water Filter and Battery Pack.", true, "info");
                }
            } else {
                this.output("Life support systems operating at optimal levels");
                this.output("Oxygen levels: Normal");
                this.output("Pressure: Stable");
                this.output("Temperature: 21°C");
            }
        }
        this.output("\n");
    }

    hasRequiredTools(system) {
        switch(system) {
            case "computer":
                return this.hasItem("Circuit Board") && this.hasItem("ASCII Table");
            case "navigation":
                return this.hasItem("Star Chart") && this.hasItem("Telescope Lens");
            case "life support":
                return this.hasItem("Water Container") && this.hasItem("First Aid Kit");
            default:
                return false;
        }
    }

    hasItem(itemName) {
        return this.inventory.some(item => item.name === itemName);
    }

    showRoomTransition(direction) {
        this.output(`\nMoving ${direction} to the ${this.rooms[this.currentRoom].name}...`, true);
        
        if (this.roomFirstVisit[this.currentRoom]) {
            this.output('\n' + this.getRoomFirstVisitDescription(), true);
            this.roomFirstVisit[this.currentRoom] = false;
        }
        
        this.output('\n' + this.rooms[this.currentRoom].description, true);
        this.feelAroundUsed = false;
        
        if (this.currentRoom === 1) {
            this.inMaintenance = true;
        }
    }

    getRoomFirstVisitDescription() {
        const descriptions = {
            0: "The airlock chamber hisses softly as pressure equalizes. Emergency backup lights cast long shadows across the curved metal walls. The faint glow of distant stars filters through the thick observation window, barely illuminating the essential equipment stored here.",
            1: "The maintenance corridor stretches before you, a claustrophobic tunnel of exposed infrastructure. Through your helmet's visor, you can see damaged electrical systems sparking in the darkness.",
            2: "The observation deck opens up into a vast panorama of stars. The reinforced windows span from floor to ceiling, offering a breathtaking view of the infinite void. Navigation equipment blinks silently, their displays casting a soft blue glow across the abandoned workstations.",
            3: "The mess hall stands frozen in time - half-eaten meals still sitting on tables, chairs askew as if hastily abandoned. The gentle hum of food preservation units provides an eerie backdrop to the scene of interrupted daily life.",
            4: "Banks of computers line the walls of the control room, their screens flickering with intermittent power. Status displays flash urgent warnings in red and amber, casting an unsettling glow across the primary command console. This is the brain of the station, and it's clearly unwell."
        };
        return descriptions[this.currentRoom] || this.rooms[this.currentRoom].description;
    }

    wrapText(text, indent = false, style = "normal") {
        const TEXT_WIDTH = 60;  // Match C++ text width
        const words = text.split(' ');
        let line = '';
        let result = '';

        for (const word of words) {
            if (line.length + word.length + 1 <= TEXT_WIDTH) {
                line += (line.length === 0 ? '' : ' ') + word;
            } else {
                result += (indent ? '    ' : '') + line + '\n';
                line = word;
            }
        }
        if (line.length > 0) {
            result += (indent ? '    ' : '') + line + '\n';
        }
        this.output(result, false, style);
    }

    displayManualText(text) {
        const lines = text.split('\n');
        lines.forEach(line => {
            if (line.startsWith('-')) {
                this.output(line, true);  // Indent bullet points
            } else {
                this.output(line, false);
            }
        });
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    const game = new Game();
}); 