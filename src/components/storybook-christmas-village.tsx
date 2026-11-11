/** Original lightweight illustration; scenery stays behind the falling snow. */
export function StorybookChristmasVillage() {
  return (
    <div className="christmas-village mt-3" aria-hidden="true">
      <svg viewBox="0 0 410 190" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="storybook-sky" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#214e5a"/><stop offset="1" stopColor="#315762"/></linearGradient>
          <linearGradient id="storybook-snow" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#f9f7e9"/><stop offset="1" stopColor="#afced1"/></linearGradient>
        </defs>
        <rect width="410" height="190" rx="12" fill="url(#storybook-sky)" opacity="0.38" />
        <g fill="#e5ebd8" opacity=".8"><circle cx="32" cy="25" r="1.8"/><circle cx="88" cy="12" r="1.3"/><circle cx="335" cy="18" r="1.4"/><circle cx="384" cy="44" r="2"/></g>
        <g stroke="#254d49" strokeWidth="2" strokeLinejoin="round">
          <path d="M8 164L37 83L66 164Z" fill="#315d52"/><path d="M20 142L37 96L54 142Z" fill="#4c7965"/>
          <path d="M49 167L76 65L103 167Z" fill="#2e594d"/><path d="M61 139L76 84L91 139Z" fill="#447b68"/>
          <path d="M303 163L328 72L353 163Z" fill="#315d52"/><path d="M315 139L328 91L341 139Z" fill="#4b7c6b"/>
          <path d="M351 165L375 83L399 165Z" fill="#315f52"/><path d="M362 140L375 100L388 140Z" fill="#4a806c"/>
        </g>
        <path d="M90 162V79H183V162" fill="#b65e53" stroke="#82463f" strokeWidth="2"/>
        <path d="M81 82L137 38L191 82Z" fill="#f6e9d7" stroke="#c1dad8" strokeWidth="4" strokeLinejoin="round"/>
        <path d="M102 82L137 55L173 82Z" fill="#8c4948"/>
        <rect className="christmas-window" x="106" y="99" width="19" height="24" rx="2" fill="#f6ca83"/>
        <rect className="christmas-window" x="150" y="99" width="19" height="24" rx="2" fill="#ffd78d"/>
        <rect x="128" y="130" width="20" height="32" rx="3" fill="#68483d"/>
        <path d="M209 162V93H312V162" fill="#597b70" stroke="#2a4c47" strokeWidth="2"/>
        <path d="M198 94L260 41L323 94Z" fill="#eee9dc" stroke="#c2d7d6" strokeWidth="4" strokeLinejoin="round"/>
        <path d="M219 94L260 60L303 94Z" fill="#8e5c55"/>
        <rect className="christmas-window" x="227" y="110" width="21" height="25" rx="2" fill="#ffd489"/>
        <rect className="christmas-window" x="279" y="110" width="20" height="25" rx="2" fill="#ffcc7b"/>
        <rect x="251" y="126" width="22" height="36" rx="3" fill="#3a5450"/>
        <path d="M140 39Q201 83 260 40Q315 68 370 83" stroke="#e5be86" strokeWidth="1.4" fill="none"/>
        <g className="christmas-window"><circle cx="163" cy="54" r="3" fill="#f6cc7d"/><circle cx="187" cy="63" r="3" fill="#e8796d"/><circle cx="209" cy="61" r="3" fill="#b2dfb0"/><circle cx="235" cy="51" r="3" fill="#f6c977"/><circle cx="285" cy="48" r="3" fill="#f6ce83"/><circle cx="308" cy="54" r="3" fill="#e8796d"/><circle cx="333" cy="65" r="3" fill="#b2dfb0"/></g>
        <path d="M0 169Q61 155 122 170T248 167T410 164V190H0Z" fill="url(#storybook-snow)"/>
        <path d="M0 178Q63 166 127 180T265 175T410 176" stroke="#fffaf0" strokeWidth="3" fill="none" opacity=".9"/>
      </svg>
    </div>
  );
}
