if(navigator.share)return;
(async function(){

	const htmlTemplate = await fetch('src/template.html').then(response => response.text());
	const cssTemplate = await fetch('src/style.css').then(response => response.text());
	const template = `${htmlTemplate} <style>${cssTemplate}</style>`;


	let isDesktop = window.innerWidth > 600;  // Hack to detect desktops / tablets 

	let shareUrls = {
    	whatsapp: payload => (isDesktop ? 'https://api.whatsapp.com/send?text=' : 'whatsapp://send?text=') + payload,
    	telegram: payload =>  (isDesktop ? 'https://telegram.me/share/msg?url='+location.host+'&text=' : 'tg://msg?text=') + payload,
    	facebook: payload => 'fb-messenger://share/?message='+payload,
    	email:    payload => 'mailto:?body='+payload    	
	}

	class WebShareUI{
		_lazyRenderDOM(){
			if(this._initialized) return;
			this._initialized = true;
			
			let el = document.createElement('div');
			el.innerHTML = template;

			this.$root     = el.querySelector('.web-share');
			this.$whatsapp = el.querySelector('.web-share-whatsapp');
			this.$facebook = el.querySelector('.web-share-facebook');
			this.$telegram = el.querySelector('.web-share-telegram');
			this.$copy     = el.querySelector('.web-share-copy');
			this.$email    = el.querySelector('.web-share-email');
		    this.$copy.onclick = _ => this._copy();
		    this.$root.onclick = _ => this._hide();

			document.body.appendChild(el);
		}

		_setPayload(payloadObj){
			let payload = payloadObj.title+' '+payloadObj.text+' '+payloadObj.url;
	    	this.payload = payload;
			payload = encodeURIComponent(payload);
	    	this.$whatsapp.href = shareUrls.whatsapp(payload);
	    	this.$facebook.href = shareUrls.facebook(payload);
	    	this.$telegram.href = shareUrls.telegram(payload);
	    	this.$email.href = shareUrls.email(payload);
		}

		_copy(){
			navigator.copy(this.payload);
		}

		show(payloadObj){
			this._lazyRenderDOM();
			this._setPayload(payloadObj);
			this.$root.classList.add('web-share-visible');
		}

		_hide(){
			this.$root.classList.remove('web-share-visible');
		}
	}

	const shareUi = new WebShareUI();

	navigator.share = function(data){
		shareUi.show(data);
		return Promise.resolve();
	}

	navigator.copy = function (text){
	  // A <span> contains the text to copy
	  var span = document.createElement('span')
	  span.textContent = text
	  span.style.whiteSpace = 'pre' // Preserve consecutive spaces and newlines

	  // An <iframe> isolates the <span> from the page's styles
	  var iframe = document.createElement('iframe')
	  iframe.sandbox = 'allow-same-origin'
	  document.body.appendChild(iframe)

	  var win = iframe.contentWindow
	  win.document.body.appendChild(span)

	  var selection = win.getSelection()

	  // Firefox fails to get a selection from <iframe> window, so fallback
	  if (!selection) {
	    win = window
	    selection = win.getSelection()
	    document.body.appendChild(span)
	  }

	  var range = win.document.createRange()
	  selection.removeAllRanges()
	  range.selectNode(span)
	  selection.addRange(range)

	  var success = false
	  try {
	    success = win.document.execCommand('copy')
	  } catch (err) {}

	  selection.removeAllRanges()
	  span.remove()
	  iframe.remove()

	  return success
	}

}());

/* Todo: auto select value to open native copy/share dialog */

/* Todo: facebook share message dialog for desktops
http://www.facebook.com/dialog/send
	?app_id=123456789
		&link=http://www.nytimes.com/
		&redirect_uri=https://www.domain.com/
	*/
