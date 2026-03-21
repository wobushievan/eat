Component({
  properties: {
    text: String,
    disabled: {
      type: Boolean,
      value: false,
    },
  },
  methods: {
    handleTap() {
      if (this.properties.disabled) {
        return
      }

      this.triggerEvent('tap')
    },
  },
})
