class TimerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TimerScene' });
        this.totalSeconds = 0;
        this.isRunning = false;
        this.timerEvent = null;
    }

    preload() {
        // No assets needed for this simple timer
    }

    create() {
        const { width, height } = this.cameras.main;

        // Add title
        this.add.text(width / 2, 80, 'Timer App', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Add timer display
        this.timerText = this.add.text(width / 2, height / 2 - 80, '00:00:00', {
            fontSize: '84px',
            fontFamily: 'monospace',
            color: '#00d4ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Create Start/Pause button
        this.startPauseButton = this.add.rectangle(width / 2 - 150, height / 2 + 50, 180, 60, 0x27ae60)
            .setInteractive({ useHandCursor: true });

        this.startPauseText = this.add.text(width / 2 - 150, height / 2 + 50, 'Start', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Create Reset button
        const resetButton = this.add.rectangle(width / 2 + 150, height / 2 + 50, 180, 60, 0xe74c3c)
            .setInteractive({ useHandCursor: true });

        const resetText = this.add.text(width / 2 + 150, height / 2 + 50, 'Reset', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Create Lap button
        this.lapButton = this.add.rectangle(width / 2, height / 2 + 130, 180, 60, 0x3498db)
            .setInteractive({ useHandCursor: true });

        this.lapText = this.add.text(width / 2, height / 2 + 130, 'Lap', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Lap times display area
        this.add.text(width / 2, height / 2 + 200, 'Lap Times', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.lapTimesText = this.add.text(width / 2, height / 2 + 240, '', {
            fontSize: '18px',
            fontFamily: 'monospace',
            color: '#aaaaaa',
            align: 'center'
        }).setOrigin(0.5);

        this.lapTimes = [];

        // Button hover effects
        this.startPauseButton.on('pointerover', () => {
            const color = this.isRunning ? 0xff9500 : 0x2ecc71;
            this.startPauseButton.setFillStyle(color);
        });
        this.startPauseButton.on('pointerout', () => {
            const color = this.isRunning ? 0xff8c00 : 0x27ae60;
            this.startPauseButton.setFillStyle(color);
        });

        resetButton.on('pointerover', () => resetButton.setFillStyle(0xff6b6b));
        resetButton.on('pointerout', () => resetButton.setFillStyle(0xe74c3c));

        this.lapButton.on('pointerover', () => this.lapButton.setFillStyle(0x5dade2));
        this.lapButton.on('pointerout', () => this.lapButton.setFillStyle(0x3498db));

        // Button click events
        this.startPauseButton.on('pointerdown', () => {
            this.toggleTimer();
        });

        resetButton.on('pointerdown', () => {
            this.resetTimer();
        });

        this.lapButton.on('pointerdown', () => {
            this.recordLap();
        });
    }

    toggleTimer() {
        if (!this.isRunning) {
            // Start the timer
            this.isRunning = true;
            this.startPauseText.setText('Pause');
            this.startPauseButton.setFillStyle(0xff8c00); // Orange for pause

            // Create a timer event that updates every 100ms for smooth display
            this.timerEvent = this.time.addEvent({
                delay: 100,
                callback: this.updateTimer,
                callbackScope: this,
                loop: true
            });
        } else {
            // Pause the timer
            this.isRunning = false;
            this.startPauseText.setText('Resume');
            this.startPauseButton.setFillStyle(0x27ae60); // Green for resume

            if (this.timerEvent) {
                this.timerEvent.remove();
                this.timerEvent = null;
            }
        }

        // Animation effect
        this.tweens.add({
            targets: this.startPauseButton,
            scale: { from: 1.1, to: 1 },
            duration: 150,
            ease: 'Back.easeOut'
        });
    }

    updateTimer() {
        this.totalSeconds += 0.1;
        this.displayTime();
    }

    displayTime() {
        const hours = Math.floor(this.totalSeconds / 3600);
        const minutes = Math.floor((this.totalSeconds % 3600) / 60);
        const seconds = Math.floor(this.totalSeconds % 60);
        const milliseconds = Math.floor((this.totalSeconds % 1) * 10);

        const timeString =
            this.padZero(hours) + ':' +
            this.padZero(minutes) + ':' +
            this.padZero(seconds) + '.' +
            milliseconds;

        this.timerText.setText(timeString);
    }

    padZero(num) {
        return num.toString().padStart(2, '0');
    }

    resetTimer() {
        // Stop the timer if running
        if (this.isRunning) {
            this.isRunning = false;
            if (this.timerEvent) {
                this.timerEvent.remove();
                this.timerEvent = null;
            }
        }

        // Reset all values
        this.totalSeconds = 0;
        this.displayTime();
        this.startPauseText.setText('Start');
        this.startPauseButton.setFillStyle(0x27ae60);

        // Clear lap times
        this.lapTimes = [];
        this.lapTimesText.setText('');

        // Animation effect
        this.tweens.add({
            targets: this.timerText,
            scale: { from: 1.2, to: 1 },
            duration: 200,
            ease: 'Back.easeOut'
        });
    }

    recordLap() {
        if (this.totalSeconds > 0) {
            const hours = Math.floor(this.totalSeconds / 3600);
            const minutes = Math.floor((this.totalSeconds % 3600) / 60);
            const seconds = Math.floor(this.totalSeconds % 60);
            const milliseconds = Math.floor((this.totalSeconds % 1) * 10);

            const lapTime =
                this.padZero(hours) + ':' +
                this.padZero(minutes) + ':' +
                this.padZero(seconds) + '.' +
                milliseconds;

            this.lapTimes.unshift(`Lap ${this.lapTimes.length + 1}: ${lapTime}`);

            // Show only the last 3 laps
            const displayLaps = this.lapTimes.slice(0, 3).join('\n');
            this.lapTimesText.setText(displayLaps);

            // Animation effect
            this.tweens.add({
                targets: this.lapButton,
                scale: { from: 1.1, to: 1 },
                duration: 150,
                ease: 'Back.easeOut'
            });
        }
    }
}

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 700,
    backgroundColor: '#1a1a2e',
    scene: TimerScene,
    parent: document.body
};

const game = new Phaser.Game(config);
