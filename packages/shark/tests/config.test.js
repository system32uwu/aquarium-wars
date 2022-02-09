const BUILD_COLLECTION = process.argv[3] || undefined
const { configPath } = require('../imports')
const makeConfig = require(configPath(BUILD_COLLECTION))
const {
  IMAGES_BASE_URI,
  IMAGES_HEIGHT,
  IMAGES_WIDTH,
  TOKEN_NAME_PREFIX,
  TOKEN_DESCRIPTION,
  TOTAL_TOKENS,
  ORDERED_TRAITS_LIST,
  OUTPUT_PATH,
  OUTPUT_PATH_META,
  OUTPUT_PATH_IMG,
} = makeConfig(BUILD_COLLECTION)

const { expect } = require('chai')

describe('Base Configuration validation:', () => {
  it('OUTPUT_PATH should be a string', () => {
    expect(OUTPUT_PATH).to.be.a('string')
  })

  it('OUTPUT_PATH_IMG should be a string', () => {
    expect(OUTPUT_PATH_IMG).to.be.a('string')
  })

  it('OUTPUT_PATH_META should be a string', () => {
    expect(OUTPUT_PATH_META).to.be.a('string')
  })

  it('IMAGES_BASE_URI should be a valid URI string', () => {
    expect(IMAGES_BASE_URI).to.be.a('string')
    const regexHttp = new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    )
    // TODO: More research on ipfs gateways (if gateway is not used, the CID of each file should be stored with the NFT, the gateway, i.e pinata, allows to "pin" a file, making it accesible through a gateway which uses http, but it sounds like this defeats the purpose of using ipfs at all, because if pinata gateway goes down then nobody will have access to their NFTs...)

    // const regexIpfs = new RegExp(
    //   /ipfs:\/\/\/Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}/
    // );

    const testHttp = regexHttp.test(IMAGES_BASE_URI)
    const testIpfs = false //regexIpfs.test(IMAGES_BASE_URI);

    expect(testHttp || testIpfs || !IMAGES_BASE_URI).to.be.true // can be http, ipfs or blank
  })

  it('TOKEN_NAME_PREFIX should be a string', () => {
    expect(TOKEN_NAME_PREFIX).to.be.a('string')
  })

  it('TOKEN_DESCRIPTION (if present) should be a string', () => {
    if (TOKEN_DESCRIPTION) {
      expect(TOKEN_DESCRIPTION).to.be.a('string')
    }
  })

  it('TOTAL_TOKENS should be an integer of at least 1', () => {
    expect(TOTAL_TOKENS % 1).to.equal(0)
    expect(TOTAL_TOKENS).to.be.a('number').of.at.least(1)
  })

  it('IMAGES_WIDTH should be an integer of at least 1', () => {
    expect(IMAGES_WIDTH % 1).to.equal(0)
    expect(IMAGES_WIDTH).to.be.a('number').of.at.least(1)
  })

  it('IMAGES_HEIGHT should be an integer of at least 1', () => {
    expect(IMAGES_HEIGHT % 1).to.equal(0)
    expect(IMAGES_HEIGHT).to.be.a('number').of.at.least(1)
  })
})

describe('Traits list validation:', () => {
  it('should be an array', () => {
    expect(ORDERED_TRAITS_LIST).to.be.an('array')
  })

  it("each trait's display (if present) should be one of: 'number', 'boost_percentage', 'boost_number', 'date'", () => {
    ORDERED_TRAITS_LIST.forEach(
      ({ display }) =>
        display &&
        expect(display).to.be.oneOf(['number', 'boost_percentage', 'boost_number', 'date'])
    )
  })

  it("each trait's type (if present) should be a string", () => {
    ORDERED_TRAITS_LIST.forEach(({ type }) => type && expect(type).to.be.a('string'))
  })

  it("each trait's type string should be unique", () => {
    const uniqueTypes = new Set()
    ORDERED_TRAITS_LIST.forEach(({ type }) => {
      if (type) {
        expect(uniqueTypes.has(type)).to.be.false
        uniqueTypes.add(type)
      }
    })
  })

  it('each trait should include an options array', () => {
    ORDERED_TRAITS_LIST.forEach(({ options }) => expect(options).to.be.an('array'))
  })

  it('each option should include a weight integer of at least 1', () => {
    ORDERED_TRAITS_LIST.forEach(({ options }) =>
      options.forEach(({ weight }) => {
        expect(weight % 1).to.equal(0)
        expect(weight).to.be.a('number').of.at.least(1)
      })
    )
  })

  it("each option's image (if present) should be a string", () => {
    ORDERED_TRAITS_LIST.forEach(({ options }) =>
      options.forEach(({ image }) => image && expect(image).to.be.a('string'))
    )
  })

  it("each option's value (if present) should be a number or a string", () => {
    ORDERED_TRAITS_LIST.forEach(({ options }) =>
      options.forEach(
        ({ value }) =>
          value && expect(value).to.satisfy((v) => ['string', 'number'].includes(typeof v))
      )
    )
  })

  it('each trait with a defined display string should also have a type', () => {
    ORDERED_TRAITS_LIST.forEach(({ display, type }) => display && expect(type).to.be.a('string'))
  })

  it('each trait with a defined display string should have options with number values', () => {
    ORDERED_TRAITS_LIST.forEach(
      ({ display, options }) =>
        display && options.forEach(({ value }) => value && expect(value).to.be.a('number'))
    )
  })

  it("each trait with display equal to 'date' should have only integer values", () => {
    ORDERED_TRAITS_LIST.forEach(
      ({ display, options }) =>
        display === 'date' &&
        options.forEach(({ value }) => {
          expect(value % 1).to.equal(0)
          expect(value).to.be.a('number')
        })
    )
  })

  it('each value from traits without a type should be unique', () => {
    const uniqueValues = new Set()
    ORDERED_TRAITS_LIST.forEach(
      ({ type, options }) =>
        !type &&
        options.forEach(({ value }) => {
          if (value) {
            expect(uniqueValues.has(value)).to.be.false
            uniqueValues.add(value)
          }
        })
    )
  })

  it("each option's allowed condition (if present) should be an array of strings", () => {
    ORDERED_TRAITS_LIST.forEach(({ options }) =>
      options.forEach(({ allowed }) => {
        if (allowed) {
          expect(allowed).to.be.an('array')
          allowed.forEach((item) => expect(item).to.be.an('string'))
        }
      })
    )
  })

  it('each allowed condition item should match an option value from a previous trait', () => {
    let allPreviousValues = []
    ORDERED_TRAITS_LIST.forEach(({ options }) => {
      const traitValues = []
      options.forEach(({ allowed, value }) => {
        if (allowed) {
          allowed.forEach((item) => expect(allPreviousValues).to.include(item))
        }
        if (value) traitValues.push(value)
      })
      allPreviousValues = allPreviousValues.concat(traitValues)
    })
  })

  it("each option's forbidden condition (if present) should be an array of strings", () => {
    ORDERED_TRAITS_LIST.forEach(({ options }) =>
      options.forEach(({ forbidden }) => {
        if (forbidden) {
          expect(forbidden).to.be.an('array')
          forbidden.forEach((item) => expect(item).to.be.an('string'))
        }
      })
    )
  })

  it('each forbidden condition item should match an option value from a previous trait', () => {
    let allPreviousValues = []
    ORDERED_TRAITS_LIST.forEach(({ options }) => {
      const traitValues = []
      options.forEach(({ forbidden, value }) => {
        if (forbidden) {
          forbidden.forEach((item) => expect(allPreviousValues).to.include(item))
        }
        if (value) traitValues.push(value)
      })
      allPreviousValues = allPreviousValues.concat(traitValues)
    })
  })

  it('no allowed condition item should be equal to a forbidden condition item in the same option', () => {
    ORDERED_TRAITS_LIST.forEach(({ options }) => {
      options.forEach(({ allowed, forbidden }) => {
        if (allowed && forbidden) {
          forbidden.forEach((item) => expect(allowed).to.not.include(item))
        }
      })
    })
  })

  it("each trait's 'ignore' setting (if present) should be boolean", () => {
    ORDERED_TRAITS_LIST.forEach(({ ignore }) => ignore && expect(ignore).to.be.a('boolean'))
  })
})
