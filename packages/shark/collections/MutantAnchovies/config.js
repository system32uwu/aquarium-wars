const config = {
  OUTPUT_PATH: `${__dirname}/output/${process.env.BUILD_COLLECTION}`,

  // UPDATE THESE CONSTANTS BELOW WITH YOUR VALUES
  GIF_FRAMES: 10,
  IMAGES_BASE_URI: 'http://',
  IMAGES_HEIGHT: 1080,
  IMAGES_WIDTH: 1080,
  TOKEN_NAME_PREFIX: 'Mutant Anchovy #',
  TOKEN_DESCRIPTION: 'A Mutant Anchovy that belongs to the Aquarium.',
  TOTAL_TOKENS: 100
}

// UPDATE THIS ARRAY BELOW WITH YOUR TRAITS LIST
config.ORDERED_TRAITS_LIST = [
  {
    type: 'Background',
    options: [
      {
        image: __dirname + '/traits/00-Background/Diamond.png',
        value: 'Diamond',
        weight: 1,
      },
      {
        image: __dirname + '/traits/00-Background/French Sky Blue.png',
        value: 'French Sky Blue',
        weight: 1,
      },
      {
        image: __dirname + '/traits/00-Background/Fresh Air.png',
        value: 'Fresh Air',
        weight: 1,
      },
    ],
  },
  {
    type: 'Weapon',
    options: [
      {
        image: '',
        value: 'None',
        weight: 6,
      },
      {
        image: __dirname + '/traits/01-Weapon/Knifey.png',
        value: 'Knifey',
        weight: 3,
      },
      {
        image: __dirname + '/traits/01-Weapon/Swiss Knifey.png',
        value: 'Swiss Knifey',
        weight: 3,
      },
      {
        image: __dirname + '/traits/01-Weapon/Basic Knife.png',
        value: 'Basic Knife',
        weight: 3,
      },
      {
        image: __dirname + '/traits/01-Weapon/Meat Knife.png',
        value: 'Meat Knife',
        weight: 3,
      },
      {
        image: __dirname + '/traits/01-Weapon/Small Knife.png',
        value: 'Small Knife',
        weight: 3,
      },
      {
        image: __dirname + '/traits/01-Weapon/Medium Knife.png',
        value: 'Medium Knife',
        weight: 2,
      },
      {
        image: __dirname + '/traits/01-Weapon/Long Knife.png',
        value: 'Long Knife',
        weight: 1,
      },
      {
        image: __dirname + '/traits/01-Weapon/Swordy.png',
        value: 'Swordy',
        weight: 1,
      },
    ],
  },
  {
    type: 'Anchovy',
    options: [
      {
        image: __dirname + '/traits/02-Anchovy/Blue Anchovy.png',
        value: 'Blue Anchovy',
        weight: 5,
      },
      {
        image: __dirname + '/traits/02-Anchovy/Yellow Anchovy.png',
        value: 'Yellow Anchovy',
        weight: 2,
      },
      {
        image: __dirname + '/traits/02-Anchovy/Mint Anchovy.png',
        value: 'Mint Anchovy',
        weight: 2,
      },
      {
        image: __dirname + '/traits/02-Anchovy/Coral Anchovy.png',
        value: 'Coral Anchovy',
        weight: 1,
      },
    ],
  },
  {
    type: 'Hat',
    options: [
      {
        image: '',
        value: 'None',
        weight: 6,
      },
      {
        image: __dirname + '/traits/03-Hat/Fedora Green.png',
        value: 'Fedora Green',
        weight: 3,
      },
      {
        image: __dirname + '/traits/03-Hat/Fedora Beige.png',
        value: 'Fedora Beige',
        weight: 3,
      },
      {
        image: __dirname + '/traits/03-Hat/Fedora Brown.png',
        value: 'Fedora Brown',
        weight: 3,
      },
      {
        image: __dirname + '/traits/03-Hat/Fedora Black.png',
        value: 'Fedora Black',
        weight: 3,
      },
      {
        image: __dirname + '/traits/03-Hat/Upturned Brim.png',
        value: 'Upturned Brim',
        weight: 2,
      },
      {
        image: __dirname + '/traits/03-Hat/Feathered Floppy.png',
        value: 'Feathered Floppy',
        weight: 2,
      },
      {
        image: __dirname + '/traits/03-Hat/Fez.png',
        value: 'Fez',
        weight: 2,
      },
      {
        image: __dirname + '/traits/03-Hat/Boater Hat.png',
        value: 'Boater Hat',
        weight: 2,
      },
      {
        image: __dirname + '/traits/03-Hat/Lucky Hat.png',
        value: 'Lucky Hat',
        weight: 1,
      },
      {
        image: __dirname + '/traits/03-Hat/Top Hat.png',
        value: 'Top Hat',
        weight: 1,
      },
    ],
  },
  {
    type: 'Mouth',
    options: [
      {
        image: '',
        value: 'None',
        weight: 5,
      },
      {
        image: __dirname + '/traits/04-Mouth/Vampire Mouth Growl.png',
        value: 'Vampire Mouth Growl',
        weight: 2,
      },
      {
        image: __dirname + '/traits/04-Mouth/Vampire Mouth Thirsty.png',
        value: 'Vampire Mouth Thirsty',
        weight: 2,
      },
      {
        image: __dirname + '/traits/04-Mouth/Vampire Mouth Open.png',
        value: 'Vampire Mouth Open',
        weight: 2,
      },
      {
        image: __dirname + '/traits/04-Mouth/Pipe.png',
        value: 'Pipe',
        weight: 1,
      },
    ],
  },
  {
    type: 'Eye',
    options: [
      {
        image: '',
        value: 'None',
        weight: 4,
      },
      {
        image: __dirname + '/traits/05-Eye/Eye-less.png',
        value: 'Eye-less',
        weight: 2,
      },
      {
        image: __dirname + '/traits/05-Eye/Blind Eyes.png',
        value: 'Blind Eyes',
        weight: 1,
      },
    ],
  },
]

module.exports = config
