class CounterScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CounterScene' });
        this.counter = 0;
    }

    preload() {
        // No assets needed for this simple counter
    }

    create() {
        const { width, height } = this.cameras.main;

        // Black background (handled by Phaser config)

        // Add title
        this.add.text(width / 2, 100, 'Simple Counter', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Add counter display
        this.counterText = this.add.text(width / 2, height / 2 - 50, '0', {
            fontSize: '96px',
            fontFamily: 'Arial',
            color: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Create increment button
        const incrementButton = this.add.rectangle(width / 2 - 120, height / 2 + 100, 200, 60, 0x27ae60)
            .setInteractive({ useHandCursor: true });

        const incrementText = this.add.text(width / 2 - 120, height / 2 + 100, 'Increment', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Create decrement button
        const decrementButton = this.add.rectangle(width / 2 + 120, height / 2 + 100, 200, 60, 0xe74c3c)
            .setInteractive({ useHandCursor: true });

        const decrementText = this.add.text(width / 2 + 120, height / 2 + 100, 'Decrement', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Create reset button
        const resetButton = this.add.rectangle(width / 2, height / 2 + 180, 200, 60, 0x95a5a6)
            .setInteractive({ useHandCursor: true });

        const resetText = this.add.text(width / 2, height / 2 + 180, 'Reset', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Button hover effects
        incrementButton.on('pointerover', () => incrementButton.setFillStyle(0x2ecc71));
        incrementButton.on('pointerout', () => incrementButton.setFillStyle(0x27ae60));

        decrementButton.on('pointerover', () => decrementButton.setFillStyle(0xff6b6b));
        decrementButton.on('pointerout', () => decrementButton.setFillStyle(0xe74c3c));

        resetButton.on('pointerover', () => resetButton.setFillStyle(0xbdc3c7));
        resetButton.on('pointerout', () => resetButton.setFillStyle(0x95a5a6));

        // Button click events
        incrementButton.on('pointerdown', () => {
            this.counter++;
            this.updateCounter();
        });

        decrementButton.on('pointerdown', () => {
            this.counter--;
            this.updateCounter();
        });

        resetButton.on('pointerdown', () => {
            this.counter = 0;
            this.updateCounter();
        });
    }

    updateCounter() {
        this.counterText.setText(this.counter.toString());

        // Add a little animation effect
        this.tweens.add({
            targets: this.counterText,
            scale: { from: 1.2, to: 1 },
            duration: 200,
            ease: 'Back.easeOut'
        });
    }
}

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scene: CounterScene,
    parent: document.body
};

const game = new Phaser.Game(config);
