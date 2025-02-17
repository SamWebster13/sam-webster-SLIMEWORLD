class Overworld extends Phaser.Scene {
    constructor() {
        super('overworldScene')
    }

    init() {
        this.VEL = 100  // slime velocity constant
    }

    preload() {
        this.load.path = './assets/'
        this.load.spritesheet('slime', 'slime.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.image('tilesetImage', 'tileset.png')
        this.load.tilemapTiledJSON('tilemapJSON', 'overworld.json')
    }

    create() {
        //tilemap
        const map = this.add.tilemap('tilemapJSON')
        const tileset = map.addTilesetImage('tileset', 'tilesetImage')
        const bgLayer = map.createLayer('background', tileset, 0, 0)
        const terrainLayer = map.createLayer('terrain', tileset, 0, 0)
        const treesLayer = map.createLayer('trees', tileset, 0, 0)


        terrainLayer.setCollisionByProperty({collides: true})
        treesLayer.setCollisionByProperty({collides: true})



        const slimeSpawn = map.findObject('spawns', (obj) => obj.name==='slimeSpawn')

        // add slime
        this.slime = this.physics.add.sprite(slimeSpawn.x, slimeSpawn.y, 'slime', 0)
        this.slime.body.setCollideWorldBounds(true)

        
        // slime animation
        this.anims.create({
            key: 'jiggle',
            frameRate: 15,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('slime', {
                start: 0,
                end: 1
            })
        })
        this.slime.play('jiggle')

        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixelsS)
        this.cameras.main.startFollow(this.slime, true, 0.25, 0.25)

        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixelsS)
        this.physics.add.collider(this.slime, terrainLayer)
        this.physics.add.collider(this.slime, treesLayer)

        
        // input
        this.cursors = this.input.keyboard.createCursorKeys()

    }

    update() {
        // slime movement
        this.direction = new Phaser.Math.Vector2(0)
        if(this.cursors.left.isDown) {
            this.direction.x = -1
        } else if(this.cursors.right.isDown) {
            this.direction.x = 1
        }

        if(this.cursors.up.isDown) {
            this.direction.y = -1
        } else if(this.cursors.down.isDown) {
            this.direction.y = 1
        }

        this.direction.normalize()
        this.slime.setVelocity(this.VEL * this.direction.x, this.VEL * this.direction.y)
    }
}