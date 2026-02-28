// ═══════════════════════════════════════════════════
  // WORDLE CARD
  // ═══════════════════════════════════════════════════

  wordle() {
    // ~200 common 5-letter words, split by difficulty
    const words = {
      easy: [
        'BRAIN','LIGHT','SMART','THINK','QUICK','LEARN','POWER','DREAM','HEART','WORLD',
        'SHARP','FOCUS','ALERT','GRASP','CLEAR','DEPTH','RAISE','SCORE','STAGE','TRACE',
        'VALUE','WATCH','PLACE','SPACE','VOICE','BLEND','BRAVE','CATCH','DANCE','EARLY',
        'GIANT','HAPPY','JUDGE','LARGE','NIGHT','OCEAN','PAINT','REACH','SOLAR','TIRED',
        'WATER','YOUNG','AFTER','CLOSE','DAILY','EARTH','FIRST','HOUSE','MAGIC','ORDER',
        'STORM','TOWER','FORCE','GRADE','LUNCH','MAYOR','NURSE','PILOT','RIVER','SIGHT',
        'TRAIN','ULTRA','VALID','WHEAT','EXTRA','FLAIR','GLOBE','HUMOR','INPUT','JOINT',
      ],
      medium: [
        'FLINT','CRISP','KNACK','GRACE','PROXY','PLUMB','SWEPT','CLUMP','BRISK','CIVIC',
        'DWARF','EXPEL','FROZE','GRUMP','HATCH','JOUST','KNEEL','LATCH','MOURN','NOTCH',
        'PERCH','QUIRK','REVEL','SNOWY','THEFT','VOUCH','WALTZ','YACHT','ABHOR','BLUNT',
        'CHANT','DEPOT','EVOKE','GUSTO','HEIST','INEPT','JUMPY','KNAVE','LODGE','MERIT',
        'NEXUS','ONSET','PARCH','QUELL','RISKY','SCALP','TAUNT','UNFIT','VENOM','WRATH',
        'YEARN','ZESTY','BLAZE','CHORD','DECOY','ENVOY','FROTH','GRAFT','HASTY','INFER',
        'LIBEL','MAXIM','NIFTY','PLAIT','QUASH','REALM','SCORN','THWAT','VIVID','WHIFF',
      ],
      hard: [
        'GLYPH','TRYST','CRYPT','PYGMY','GYPSY','BORAX','CYNIC','EPOXY','FJORD','GHOUL',
        'ICHOR','KUDZU','MYRRH','NYMPH','OKAPI','PSYCH','QUAFF','SYNTH','TABBY','ULCER',
        'AXIOM','BUSHY','CHIMP','DUCHY','ELFIN','FETID','GAUZE','HUSKY','IGLOO','JUICY',
        'KITTY','LUSTY','MURKY','NUTTY','OUGHT','PERKY','QUALM','RUSTY','SAVVY','TAWNY',
        'VERVE','WITTY','FIZZY','GAUDY','HIPPO','IMPLY','JUMBO','KNOLL','LYRIC','NADIR',
        'OVULE','PIXEL','QUASAR','RABID','SCOFF','TWIXT','UNZIP','VEXED','WIZEN','EXPEL',
      ],
    };

    const tier   = this.rand(0, 2);
    const tiers  = ['easy', 'medium', 'hard'];
    const diffs  = [0.8, 1.2, 1.7];
    const word   = this.pick(words[tiers[tier]]);

    return {
      type:          'wordle',
      category:      'verbalReasoning',
      categoryLabel: 'Wordle',
      difficulty:    diffs[tier],
      question:      'Guess the 5-letter word',
      answer:        word,
      options:       [],          // not used — keyboard handles input
      explanation:   `The word was ${word}.`,
      visual:        'wordle',
      maxGuesses:    6,
    };
  },