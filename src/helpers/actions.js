import {
	exec,
	removeBlockTagsRecursive,
	getActionBtns,
	saveRange,
	restoreRange
} from "./util";

import { get } from "svelte/store";

const linkSvg =
	'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M31.1 48.9l-6.7 6.7c-.8.8-1.6.9-2.1.9s-1.4-.1-2.1-.9L15 50.4c-1.1-1.1-1.1-3.1 0-4.2l6.1-6.1.2-.2 6.5-6.5c-1.2-.6-2.5-.9-3.8-.9-2.3 0-4.6.9-6.3 2.6L11 41.8c-3.5 3.5-3.5 9.2 0 12.7l5.2 5.2c1.7 1.7 4 2.6 6.3 2.6s4.6-.9 6.3-2.6l6.7-6.7c2.5-2.6 3.1-6.7 1.5-10l-5.9 5.9zM38.7 22.5l6.7-6.7c.8-.8 1.6-.9 2.1-.9s1.4.1 2.1.9l5.2 5.2c1.1 1.1 1.1 3.1 0 4.2l-6.1 6.1-.2.2L42 38c1.2.6 2.5.9 3.8.9 2.3 0 4.6-.9 6.3-2.6l6.7-6.7c3.5-3.5 3.5-9.2 0-12.7l-5.2-5.2c-1.7-1.7-4-2.6-6.3-2.6s-4.6.9-6.3 2.6l-6.7 6.7c-2.7 2.7-3.3 6.9-1.7 10.2l6.1-6.1c0 .1 0 .1 0 0z"></path><path d="M44.2 30.5c.2-.2.4-.6.4-.9 0-.3-.1-.6-.4-.9l-2.3-2.3c-.3-.2-.6-.4-.9-.4-.3 0-.6.1-.9.4L25.9 40.6c-.2.2-.4.6-.4.9 0 .3.1.6.4.9l2.3 2.3c.2.2.6.4.9.4.3 0 .6-.1.9-.4l14.2-14.2zM49.9 55.4h-8.5v-5h8.5v-8.9h5.2v8.9h8.5v5h-8.5v8.9h-5.2v-8.9z"></path></svg>';
const unlinkSvg =
	'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M30.9 49.1l-6.7 6.7c-.8.8-1.6.9-2.1.9s-1.4-.1-2.1-.9l-5.2-5.2c-1.1-1.1-1.1-3.1 0-4.2l6.1-6.1.2-.2 6.5-6.5c-1.2-.6-2.5-.9-3.8-.9-2.3 0-4.6.9-6.3 2.6L10.8 42c-3.5 3.5-3.5 9.2 0 12.7l5.2 5.2c1.7 1.7 4 2.6 6.3 2.6s4.6-.9 6.3-2.6l6.7-6.7C38 50.5 38.6 46.3 37 43l-6.1 6.1zM38.5 22.7l6.7-6.7c.8-.8 1.6-.9 2.1-.9s1.4.1 2.1.9l5.2 5.2c1.1 1.1 1.1 3.1 0 4.2l-6.1 6.1-.2.2-6.5 6.5c1.2.6 2.5.9 3.8.9 2.3 0 4.6-.9 6.3-2.6l6.7-6.7c3.5-3.5 3.5-9.2 0-12.7l-5.2-5.2c-1.7-1.7-4-2.6-6.3-2.6s-4.6.9-6.3 2.6l-6.7 6.7c-2.7 2.7-3.3 6.9-1.7 10.2l6.1-6.1z"></path><path d="M44.1 30.7c.2-.2.4-.6.4-.9 0-.3-.1-.6-.4-.9l-2.3-2.3c-.2-.2-.6-.4-.9-.4-.3 0-.6.1-.9.4L25.8 40.8c-.2.2-.4.6-.4.9 0 .3.1.6.4.9l2.3 2.3c.2.2.6.4.9.4.3 0 .6-.1.9-.4l14.2-14.2zM41.3 55.8v-5h22.2v5H41.3z"></path></svg>';

export default {
	viewHtml: {
		icon:
			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path fill="none" stroke="currentColor" stroke-width="8" stroke-miterlimit="10" d="M26.9 17.9L9 36.2 26.9 54M45 54l17.9-18.3L45 17.9"></path></svg>',
		title: "View HTML",
		result: function() {
			let refs = get(this.references);
			let actionObj = get(this.state).actionObj;
			let helper = get(this.helper);

			helper.showEditor = !helper.showEditor;
			refs.editor.style.display = helper.showEditor ? "block" : "none";
			refs.raw.style.display = helper.showEditor ? "none" : "block";
			if (helper.showEditor) {
				refs.editor.innerHTML = refs.raw.value;
			} else {
				refs.raw.value = refs.editor.innerHTML;
			}
			setTimeout(() => {
				Object.keys(actionObj).forEach(
					action => (actionObj[action].disabled = !helper.showEditor)
				);
				actionObj.viewHtml.disabled = false;
				actionObj.viewHtml.active = !helper.showEditor;

				this.state.update(state => {
					state.actionBtns = getActionBtns(actionObj);
					state.actionObj = actionObj;
					return state;
				});
			});
		}
	},
	undo: {
		icon:
			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M61.2 51.2c0-5.1-2.1-9.7-5.4-13.1-3.3-3.3-8-5.4-13.1-5.4H26.1v-12L10.8 36l15.3 15.3V39.1h16.7c3.3 0 6.4 1.3 8.5 3.5 2.2 2.2 3.5 5.2 3.5 8.5h6.4z"></path></svg>',
		title: "Undo",
		result: () => exec("undo")
	},
	redo: {
		icon:
			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M10.8 51.2c0-5.1 2.1-9.7 5.4-13.1 3.3-3.3 8-5.4 13.1-5.4H46v-12L61.3 36 45.9 51.3V39.1H29.3c-3.3 0-6.4 1.3-8.5 3.5-2.2 2.2-3.5 5.2-3.5 8.5h-6.5z"></path></svg>',
		title: "Redo",
		result: () => exec("redo")
	},
	b: {
		icon: "<b>B</b>",
		title: "Bold",
		result: () => exec("bold")
	},
	i: {
		icon: "<i>I</i>",
		title: "Italic",
		result: () => exec("italic")
	},
	u: {
		icon: "<u>U</u>",
		title: "Underline",
		result: () => exec("underline")
	},
	strike: {
		icon: "<strike>S</strike>",
		title: "Strike-through",
		result: () => exec("strikeThrough")
	},
	sup: {
		icon: "A<sup>2</sup>",
		title: "Superscript",
		result: () => exec("superscript")
	},
	sub: {
		icon: "A<sub>2</sub>",
		title: "Subscript",
		result: () => exec("subscript")
	},
	h1: {
		icon: "<b>H<sub>1</sub></b>",
		title: "Heading 1",
		result: () => exec("formatBlock", "<H1>")
	},
	h2: {
		icon: "<b>H<sub>2</sub></b>",
		title: "Heading 2",
		result: () => exec("formatBlock", "<H2>")
	},
	p: {
		icon: "&#182;",
		title: "Paragraph",
		result: () => exec("formatBlock", "<P>")
	},
	blockquote: {
		icon: "&#8220; &#8221;",
		title: "Quote",
		result: () => exec("formatBlock", "<BLOCKQUOTE>")
	},
	ol: {
		icon:
			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M27 14h36v8H27zM27 50h36v8H27zM27 32h36v8H27zM11.8 15.8V22h1.8v-7.8h-1.5l-2.1 1 .3 1.3zM12.1 38.5l.7-.6c1.1-1 2.1-2.1 2.1-3.4 0-1.4-1-2.4-2.7-2.4-1.1 0-2 .4-2.6.8l.5 1.3c.4-.3 1-.6 1.7-.6.9 0 1.3.5 1.3 1.1 0 .9-.9 1.8-2.6 3.3l-1 .9V40H15v-1.5h-2.9zM13.3 53.9c1-.4 1.4-1 1.4-1.8 0-1.1-.9-1.9-2.6-1.9-1 0-1.9.3-2.4.6l.4 1.3c.3-.2 1-.5 1.6-.5.8 0 1.2.3 1.2.8 0 .7-.8.9-1.4.9h-.7v1.3h.7c.8 0 1.6.3 1.6 1.1 0 .6-.5 1-1.4 1-.7 0-1.5-.3-1.8-.5l-.4 1.4c.5.3 1.3.6 2.3.6 2 0 3.2-1 3.2-2.4 0-1.1-.8-1.8-1.7-1.9z"></path></svg>',
		title: "Ordered List",
		result: () => exec("insertOrderedList")
	},
	ul: {
		icon:
			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M27 14h36v8H27zM27 50h36v8H27zM9 50h9v8H9zM9 32h9v8H9zM9 14h9v8H9zM27 32h36v8H27z"></path></svg>',
		title: "Unordered List",
		result: () => exec("insertUnorderedList")
	},
	hr: {
		icon: "&#8213;",
		title: "Horizontal Line",
		result: () => exec("insertHorizontalRule")
	},
	left: {
		icon:
			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M9 14h54v8H9zM9 50h54v8H9zM9 32h36v8H9z"></path></svg>',
		title: "Justify left",
		result: () => exec("justifyLeft")
	},
	right: {
		icon:
			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M9 14h54v8H9zM9 50h54v8H9zM27 32h36v8H27z"></path></svg>',
		title: "Justify right",
		result: () => exec("justifyRight")
	},
	center: {
		icon:
			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M9 14h54v8H9zM9 50h54v8H9zM18 32h36v8H18z"></path></svg>',
		title: "Justify center",
		result: () => exec("justifyCenter")
	},
	justify: {
		icon:
			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M9 14h54v8H9zM9 50h54v8H9zM9 32h54v8H9z"></path></svg>',
		title: "Justify full",
		result: () => exec("justifyFull")
	},
	a: {
		icon: linkSvg,
		title: "Insert link",
		result: function() {
			const actionObj = get(this.state).actionObj;
			const refs = get(this.references);

			if (actionObj.a.active) {
				const selection = window.getSelection();
				const range = document.createRange();
				range.selectNodeContents(document.getSelection().focusNode);
				selection.removeAllRanges();
				selection.addRange(range);
				exec("unlink");
				actionObj.a.title = "Insert link";
				actionObj.a.icon = linkSvg;
				this.state.update(state => {
					state.actionBtn = getActionBtns(actionObj);
					state.actionObj = actionObj;
					return state;
				});
			} else {
				saveRange(refs.editor);
				refs.modal.$set({
					show: true,
					event: "linkUrl",
					title: "Insert link",
					label: "Url"
				});
				if (!get(this.helper).link) {
					this.helper.update(state => {
						state.link = true;
						return state;
					});
					refs.modal.$on("linkUrl", event => {
						restoreRange(refs.editor);
						exec("createLink", event.detail);
						actionObj.a.title = "Unlink";
						actionObj.a.icon = unlinkSvg;

						this.state.update(state => {
							state.actionBtn = getActionBtns(actionObj);
							state.actionObj = actionObj;
							return state;
						});
					});
				}
			}
		}
	},
	image: {
		icon:
			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M64 17v38H8V17h56m8-8H0v54h72V9z"></path><path d="M17.5 22C15 22 13 24 13 26.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zM16 50h27L29.5 32zM36 36.2l8.9-8.5L60.2 50H45.9S35.6 35.9 36 36.2z"></path></svg>',
		title: "Image",
		result: function() {
			const refs = get(this.references);
			saveRange(refs.editor);
			refs.modal.$set({
				show: true,
				event: "imageUrl",
				title: "Insert image",
				label: "Url"
			});
			if (!get(this.helper).image) {
				this.helper.update(state => {
					state.image = true;
					return state;
				});
				refs.modal.$on("imageUrl", event => {
					restoreRange(refs.editor);
					exec("insertImage", event.detail);
				});
			}
		}
	},
	forecolor: {
		icon:
			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M32 15h7.8L56 57.1h-7.9l-4-11.1H27.4l-4 11.1h-7.6L32 15zm-2.5 25.4h12.9L36 22.3h-.2l-6.3 18.1z"></path></svg>',
		title: "Text color",
		colorPicker: true,
		result: function() {
			showColorPicker.call(this, "foreColor");
		}
	},
	backcolor: {
		icon:
			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M36.5 22.3l-6.3 18.1H43l-6.3-18.1z"></path><path d="M9 8.9v54.2h54.1V8.9H9zm39.9 48.2L45 46H28.2l-3.9 11.1h-7.6L32.8 15h7.8l16.2 42.1h-7.9z"></path></svg>',
		title: "Background color",
		colorPicker: true,
		result: function() {
			showColorPicker.call(this, "backColor");
		}
	},
	removeFormat: {
		icon:
			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M58.2 54.6L52 48.5l3.6-3.6 6.1 6.1 6.4-6.4 3.8 3.8-6.4 6.4 6.1 6.1-3.6 3.6-6.1-6.1-6.4 6.4-3.7-3.8 6.4-6.4zM21.7 52.1H50V57H21.7zM18.8 15.2h34.1v6.4H39.5v24.2h-7.4V21.5H18.8v-6.3z"></path></svg>',
		title: "Remove format",
		result: function() {
			const refs = get(this.references);
			const selection = window.getSelection();
			if (!selection.toString().length) {
				removeBlockTagsRecursive(
					refs.editor.children,
					this.removeFormatTags
				);
				const range = document.createRange();
				range.selectNodeContents(refs.editor);
				selection.removeAllRanges();
				selection.addRange(range);
			}
			exec("removeFormat");
			selection.removeAllRanges();
		}
	},
	rtl: {
		icon: '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5001 3C10.4625 3 8.00011 5.46243 8.00011 8.5C8.00011 11.5376 10.4625 14 13.5001 14H15.0001V21.208C15.0001 21.6454 15.3359 22 15.7501 22C16.1643 22 16.5001 21.6454 16.5001 21.208V4.5H18.0001V21.208C18.0001 21.6454 18.3359 22 18.7501 22C19.1643 22 19.5001 21.6454 19.5001 21.208V4.5H20.0453L20.1748 4.49315C20.6409 4.44349 21.0001 4.1297 21.0001 3.75C21.0001 3.33579 20.5726 3 20.0453 3H13.5001ZM13.5001 4.5H15.0001V12.5H13.5001C11.291 12.5 9.50011 10.7091 9.50011 8.5C9.50011 6.29086 11.291 4.5 13.5001 4.5Z" fill="#212121"/><path d="M4.07978 11.8575C3.82419 12.0588 3.45294 12.0479 3.20927 11.8179C2.94123 11.5649 2.92906 11.1425 3.18209 10.8744L4.89557 9L3.18209 7.12557L3.11965 7.04889C2.93339 6.78213 2.9656 6.41212 3.20927 6.18209C3.47731 5.92906 3.89972 5.94123 4.15275 6.20927L6.29873 8.54185L6.36428 8.62306C6.53909 8.87797 6.51724 9.22668 6.29873 9.45815L4.15275 11.7907L4.07978 11.8575Z" fill="#212121"/><path d="M5.40104 19.8575C5.65663 20.0588 6.02788 20.0479 6.27155 19.8179C6.53959 19.5649 6.55176 19.1425 6.29873 18.8744L4.58525 17L6.29873 15.1256L6.36117 15.0489C6.54743 14.7821 6.51523 14.4121 6.27155 14.1821C6.00351 13.9291 5.5811 13.9412 5.32807 14.2093L3.18209 16.5418L3.11654 16.6231C2.94173 16.878 2.96358 17.2267 3.18209 17.4582L5.32807 19.7907L5.40104 19.8575Z" fill="#212121"/></svg>',
		title: "Toggle RTL/LTR	",
		result: function() {
		  const refs = get(this.references);
		  const currentDirection = refs.editor.style.direction;
		  if (currentDirection === 'rtl') {
			refs.editor.style.direction = 'ltr';
		  } else {
			refs.editor.style.direction = 'rtl';
		  }
		}
	  }
};

const showColorPicker = function(cmd) {
	const refs = get(this.references);
	saveRange(refs.editor);
	refs.colorPicker.$set({show: true, event: cmd});
	if (!get(this.helper)[cmd]) {
		this.helper.update(state => {
			state[cmd] = true;
			return state;
		});
		refs.colorPicker.$on(cmd, event => {
			let item = event.detail;
			if (item.modal) {
				refs.modal.$set({
					show: true,
					event: `${cmd}Changed`,
					title: "Text color",
					label:
						cmd === "foreColor" ? "Text color" : "Background color"
				});
				const command = cmd;
				if (!get(this.helper)[`${command}Modal`]) {
					get(this.helper)[`${command}Modal`] = true;
					refs.modal.$on(`${command}Changed`, event => {
						let color = event.detail;
						restoreRange(refs.editor);
						exec(command, color);
					});
				}
			} else {
				restoreRange(refs.editor);
				exec(cmd, item.color);
			}
		});
	}
};
