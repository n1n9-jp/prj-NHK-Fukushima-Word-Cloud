class ZModal {
  constructor(options) {
    this.closeBtn = null;
    this.modal = null;
    this.btns = [];

    const defaults = {
      className: "",
      title: "Z-MODAL",
      content: '<h1>Congratulations!!!</h1><p>You are using the realy awesome Z-Modal javascript plugin. <b>Thank You!</b></p><p>Author: <a href="http://caradeuc.info/">Benjamin Caradeuc</a></p>',
      closeBtn: false,
      autoload: true,
      onClose: null,
      buttons: [
        { label: "ok", half: false, callback: function() { console.log('Thank you for using Z-Modal plugin.'); } }
      ]
    };

    if (options && typeof options === "object") {
      this.options = { ...defaults, ...options };
    } else {
      this.options = defaults;
    }

    if (this.options.autoload === true) {
      this.open();
    }
  }

  // open the modal
  open() {
    this._build();
  }

  // close the modal
  close(callback) {
    if (typeof callback === 'function') {
      callback();
    } else if (typeof this.options.onClose === 'function') {
      this.options.onClose();
    }

    // Call global function if it exists (specific to this application structure)
    if (typeof window.closeDetailBtn === 'function') {
      window.closeDetailBtn();
    }

    // remove the modal
    if (this.modal && this.modal.parentNode) {
      this.modal.parentNode.removeChild(this.modal);
    }
  }

  // Private-like build method
  _build() {
    let theContent;
    
    if (typeof this.options.content === "string") {
      theContent = this.options.content;
    } else {
      theContent = this.options.content.innerHTML;
    }

    // modal element creation
    this.modal = document.createElement("div");
    this.modal.className = "z-modal " + this.options.className;
    
    // Equivalent to __initListener with noDeep=true
    this.modal.addEventListener("click", (e) => {
        if(e.target === this.modal){
             this.close();
        }
    }, false);

    // the box
    const box = document.createElement("div");
    box.className = "z-modal-box";
    this.modal.appendChild(box);

    // the box header
    const header = document.createElement("div");
    header.className = "z-modal-header";

    // title
    const title = document.createElement("div");
    title.className = "z-modal-title";
    title.innerHTML = this.options.title;
    header.appendChild(title);

    // closeBtn
    if (this.options.closeBtn === true) {
      this.closeBtn = document.createElement("div");
      this.closeBtn.className = "z-modal-close";
      this.closeBtn.innerHTML = "&#215;";
      this.closeBtn.addEventListener("click", () => {
        this.close();
      }, false);
      header.appendChild(this.closeBtn);
    }

    // the box content
    const content = document.createElement("div");
    content.className = "z-modal-content";
    content.innerHTML = theContent;

    // the box footer
    const footer = document.createElement("div");
    footer.className = "z-modal-footer";

    // the buttons
    if (this.options.buttons && Array.isArray(this.options.buttons)) {
        this.options.buttons.forEach((btnOpt) => {
            const btn = document.createElement("div");
            btn.className = "z-modal-btn";
            btn.innerHTML = btnOpt.label;
            if (btnOpt.half === true) {
                btn.className += " z-modal-btn-half";
            }
            btn.addEventListener("click", () => {
                this.close(btnOpt.callback);
            }, false);
            footer.appendChild(btn);
        });
    }

    // populate the box
    box.appendChild(header);
    box.appendChild(content);
    box.appendChild(footer);

    // add the modal to the dom
    document.body.appendChild(this.modal);
  }
}

// Export to global scope for compatibility with app.js
window.ZMODAL = ZModal;
