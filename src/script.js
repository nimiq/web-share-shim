(function(){
	if(navigator.share)return;

	let android = navigator.userAgent.match(/Android/i);
    let ios = navigator.userAgent.match(/iPhone|iPad|iPod/i);
	let isDesktop = !(ios || android); // on those two support "mobile deep links", so HTTP based fallback for all others.

	// sms on ios 'sms:;body='+payload, on Android 'sms:?body='+payload
	let shareUrls = {
    	whatsapp: payload => (isDesktop ? 'https://api.whatsapp.com/send?text=' : 'whatsapp://send?text=') + payload,
    	telegram: payload => (isDesktop ? 'https://telegram.me/share/msg?url='+location.host+'&text=' : 'tg://msg?text=') + payload,
    	facebook: (payload, fbid, url) => !fbid ? "" : (isDesktop ? 'https://www.facebook.com/dialog/share?app_id='+fbid+'&display=popup&href='+url+'&redirect_uri='+encodeURIComponent(location.href)+'&quote=' : 'fb-messenger://share/?message=') + payload,
    	email:    payload => 'mailto:?body='+payload,
    	sms:      payload => 'sms:?body='+payload 	
	};

	class WebShareUI{
		/*async*/
		_init(){
			if(this._initialized) return Promise.resolve();
			this._initialized = true;

            const templatePromise = fetch('../src/template.html').then(response => response.text());

            return templatePromise.then(template => {
                const el = document.createElement('div');
                el.innerHTML = template;

                this.$root     = el.querySelector('.web-share');
                this.$whatsapp = el.querySelector('.web-share-whatsapp');
                this.$facebook = el.querySelector('.web-share-facebook');
                this.$telegram = el.querySelector('.web-share-telegram');
                this.$email    = el.querySelector('.web-share-email');
                this.$sms      = el.querySelector('.web-share-sms');
                this.$copy     = el.querySelector('.web-share-copy');
                this.$copy.onclick = () => this._copy();
                this.$root.onclick = () => this._hide();
                this.$root.classList.toggle('desktop', isDesktop);

                document.body.appendChild(el);
			});
		}

		_setPayload(payloadObj){
			let payload = payloadObj.title+' '+payloadObj.text+' '+payloadObj.url;
			let facebookId = payloadObj.facebookId || '158651941570418';
	    	this.payload = payload;
			payload = encodeURIComponent(payload);
	    	this.$whatsapp.href = shareUrls.whatsapp(payload);
	    	this.$facebook.href = shareUrls.facebook(payload, facebookId, payloadObj.url);
	    	this.$telegram.href = shareUrls.telegram(payload);
	    	this.$email.href = shareUrls.email(payload);
	    	this.$sms.href = shareUrls.sms(payload);
		}

		_copy(){
            // A <span> contains the text to copy
            const span = document.createElement('span');
            span.textContent = this.payload;
            span.style.whiteSpace = 'pre'; // Preserve consecutive spaces and newlines

            // An <iframe> isolates the <span> from the page's styles
            const iframe = document.createElement('iframe');
            iframe.sandbox = 'allow-same-origin';
            document.body.appendChild(iframe);

            let win = iframe.contentWindow;
            win.document.body.appendChild(span);

            let selection = win.getSelection();

            // Firefox fails to get a selection from <iframe> window, so fallback
            if (!selection) {
                win = window;
                selection = win.getSelection();
                document.body.appendChild(span)
            }

            const range = win.document.createRange();
            selection.removeAllRanges();
            range.selectNode(span);
            selection.addRange(range);

            let success = false;
            try {
                success = win.document.execCommand('copy')
            } catch (err) {}

            selection.removeAllRanges();
            span.remove();
            iframe.remove();

            return success;
		}

		/*async*/
		show(payloadObj){
			return this._init().then(() => {
                this._setPayload(payloadObj);
                this.$root.classList.add('web-share-visible');
			});
		}

		_hide(){
			this.$root.classList.remove('web-share-visible');
		}
	}

	const shareUi = new WebShareUI();

	navigator.share = function(data){
		return shareUi.show(data);
	};

}());

/* Todo: auto select value to open native copy/share dialog */

/* Todo: facebook share message dialog for desktops
http://www.facebook.com/dialog/send
	?app_id=123456789
		&link=http://www.nytimes.com/
		&redirect_uri=https://www.domain.com/
	*/


// See also: http://chriswren.github.io/native-social-interactions/ 

// See also: https://www.sharethis.com/platform/share-buttons/

