  FULL AUDIT REPORT                                                                                      
                                                                                                         
  ---                                                                                                    
  ─── 1. PADDING ISSUES ───                                                                              
                                                                                                         
  A. Uses shorthand (4-side) padding instead of vertical-only                                            
                                                                                                         
  File: CTAPreview.jsx                                                                                   
  Line: 24                                                                                               
  Problem: padding: isMobile ? '32px 20px' : (template.padding || '64px 32px') — template.padding is a   
  raw                                                                                                    
    number (80). padding: 80 is invalid CSS (no px).                                                     
  Should be: paddingTop/Bottom: \${template.padding}px``, separate horizontal                            
  ────────────────────────────────────────                                                               
  File: FooterPreview.jsx                                                                                
  Line: 32                                                                                             
  Problem: wrapStyle.padding: template.padding || '80px 48px' — template.padding is a number (64), so CSS
  
    gets padding: 64 (no px)                                                                             
  Should be: Separate paddingTop/Bottom with px, separate horizontal                                   
  ────────────────────────────────────────
  File: ContactPreview.jsx                                                                               
  Line: 78
  Problem: padding = \${template.padding ?? 64}px 32px`— 4-side shorthand, horizontal hardcoded to32px`  
  Should be: Separate paddingTop/Bottom; use SECTION_PADDING_X for horizontal                          
  ────────────────────────────────────────
  File: FormPreview.jsx                                                                                  
  Line: 31
  Problem: padding: isMobile ? '24px 20px' : \${template.padding ?? 48}px 32px`` — 4-side shorthand      
  Should be: Same fix                                                                                  
  ────────────────────────────────────────
  File: SocialMediaPreview.jsx                                                                           
  Line: 95
  Problem: padding: isMobile ? '32px 20px' : \${template.padding ?? 64}px 32px`` — 4-side shorthand      
  Should be: Same fix                                                                                  
  ────────────────────────────────────────
  File: BlogListPreview.jsx                                                                              
  Line: 34
  Problem: padding: \${padding}px 32px`` — 4-side shorthand, no mobile check at all                      
  Should be: Separate paddingTop/Bottom; use SECTION_PADDING_X                                         
  ────────────────────────────────────────
  File: BlogPostPreview.jsx                                                                              
  Line: 81
  Problem: padding: \${padding}px 32px`` — same, inside the content container                            
  Should be: Same fix                                                                                  
  ────────────────────────────────────────
  File: NavbarPreview.jsx                                                                                
  Line: 177
  Problem: padding: template.padding || '12px 24px' — 4-side string from template. navbar is special but 
    theme.json stores "12px 24px" (string not a number) — inconsistent with all other sections         
  Should be: Acceptable by design but inconsistent

  B. Wrong padding key — builder writes a key the preview never reads                                    
  
  ┌───────────────────────────┬──────────────────────────────────────────────────────────────────────┐   
  │           File            │                                Issue                                 │ 
  ├───────────────────────────┼──────────────────────────────────────────────────────────────────────┤   
  │                           │ CRITICAL BUG. theme.json stores team.template.paddingY: "80". Both   │ 
  │ TeamPreview.jsx +         │ builder and preview use template.padding (which is undefined), so    │
  │ TeamBuilder.jsx           │ the preview always falls back to parseInt(undefined ?? 48) = 48, and │   
  │                           │  the builder's Vertical Padding control does nothing.                │
  ├───────────────────────────┼──────────────────────────────────────────────────────────────────────┤   
  │                           │ CRITICAL BUG. theme.json aboutDetail.template has no padding key     │ 
  │ AboutDetailPreview.jsx +  │ (has contentTopSpacing/contentBottomSpacing). Both preview and       │   
  │ AboutDetailBuilder.jsx    │ builder use template.padding, always falling back to 48. Control     │
  │                           │ does nothing.                                                        │   
  ├───────────────────────────┼──────────────────────────────────────────────────────────────────────┤ 
  │                           │ Builder has a "Vertical Padding" field writing to template.padding,  │
  │ CarouselBuilder.jsx       │ but CarouselPreview.jsx never reads template.padding. The carousel   │   
  │                           │ fills its height via template.height. Padding control does nothing.  │
  ├───────────────────────────┼──────────────────────────────────────────────────────────────────────┤   
  │                           │ Builder has "Vertical Padding" writing to template.padding;          │ 
  │ PageBannerBuilder.jsx     │ PageBannerPreview.jsx never reads it (banner uses bannerHeight).     │   
  │                           │ Control does nothing.                                                │
  └───────────────────────────┴──────────────────────────────────────────────────────────────────────┘   
                                                                                                       
  C. Missing padding control entirely

  ┌─────────────────────┬─────────────────────────────────────────────────────────────────────────────┐  
  │        File         │                                    Issue                                    │
  ├─────────────────────┼─────────────────────────────────────────────────────────────────────────────┤  
  │                     │ No section-level vertical padding control exists or is consumed —           │
  │ CarouselPreview.jsx │ intentional by design (carousel fills set height), but the builder          │
  │                     │ misleadingly shows a Vertical Padding slider                                │  
  └─────────────────────┴─────────────────────────────────────────────────────────────────────────────┘
                                                                                                         
  ---                                                                                                  
  ─── 2. INNER CONTENT WRAPPER ISSUES ───
                                                                                                         
  A. Double padding — padding: '0 32px' inside an innerStyle that's already inside a padded section
                                                                                                         
  ┌────────────────────────┬────────┬─────────────────────────────────────────────────────────────────┐
  │          File          │  Line  │                             Problem                             │  
  ├────────────────────────┼────────┼─────────────────────────────────────────────────────────────────┤
  │                        │        │ Section already has paddingLeft/Right: SECTION_PADDING_X, then  │
  │ AboutDetailPreview.jsx │ 48–51  │ inner div adds padding: '0 32px' — adds 32px on top of 32px on  │
  │                        │        │ each side                                                       │  
  ├────────────────────────┼────────┼─────────────────────────────────────────────────────────────────┤
  │ TeamPreview.jsx        │ 96–100 │ Same pattern: section has SECTION_PADDING_X, inner div adds     │  
  │                        │        │ padding: '0 32px' on top                                        │  
  └────────────────────────┴────────┴─────────────────────────────────────────────────────────────────┘
                                                                                                         
  B. Missing isMobile max-width override on innerStyle                                                   
  
  No preview uses maxWidth: '100%' for the mobile breakpoint on innerStyle — all use maxWidth:           
  CONTENT_MAX_WIDTH ('90%') unconditionally. Since 90% is already responsive this is minor, but it means
  very narrow containers get 90% width instead of 100%.                                                  
                                                                                                       
  C. No innerStyle at all                                                                                
  
  ┌───────────────────────┬────────────────────────────────────────────────────────────┐                 
  │         File          │                            Note                            │               
  ├───────────────────────┼────────────────────────────────────────────────────────────┤
  │ CarouselPreview.jsx   │ No innerStyle — carousel is full-width by design (correct) │
  ├───────────────────────┼────────────────────────────────────────────────────────────┤
  │ PageBannerPreview.jsx │ No innerStyle — full-width banner by design (correct)      │                 
  └───────────────────────┴────────────────────────────────────────────────────────────┘                 
                                                                                                         
  ---                                                                                                    
  ─── 3. HEADING / SUBHEADING ISSUES ───                                                               
                                        
  A. Heading styles defined locally instead of using headingStyle()
                                                                                                         
  ┌────────────────────────┬─────────┬────────────────────────────────────────────────────────────────┐
  │          File          │  Line   │                            Problem                             │  
  ├────────────────────────┼─────────┼────────────────────────────────────────────────────────────────┤
  │ HeroPreview.jsx        │ 87–96   │ h1 style defined inline with custom 'Syne' font, fontWeight    │
  │                        │         │ 500 — entirely skips headingStyle()                            │
  ├────────────────────────┼─────────┼────────────────────────────────────────────────────────────────┤  
  │ CarouselPreview.jsx    │ 108–115 │ titleStyle defined locally — doesn't use headingStyle()        │
  ├────────────────────────┼─────────┼────────────────────────────────────────────────────────────────┤  
  │ BlogPostPreview.jsx    │ 104–113 │ Post h1 style defined inline — no headingStyle()               │
  ├────────────────────────┼─────────┼────────────────────────────────────────────────────────────────┤  
  │ AboutDetailPreview.jsx │ 55–64   │ Section heading h2 style defined locally (color, fontSize,     │
  │                        │         │ fontWeight hardcoded) — no headingStyle()                      │  
  ├────────────────────────┼─────────┼────────────────────────────────────────────────────────────────┤
  │ PageBannerPreview.jsx  │ 56–63   │ h1 defined locally — no headingStyle()                         │  
  └────────────────────────┴─────────┴────────────────────────────────────────────────────────────────┘  
  
  B. Subheading styles defined locally instead of using subheadingStyle()                                
                                                                                                       
  ┌────────────────────────┬─────────┬─────────────────────────────────────────────────┐                 
  │          File          │  Line   │                     Problem                     │               
  ├────────────────────────┼─────────┼─────────────────────────────────────────────────┤
  │ CarouselPreview.jsx    │ 117–124 │ subtitleStyle defined locally                   │
  ├────────────────────────┼─────────┼─────────────────────────────────────────────────┤
  │ BlogPostPreview.jsx    │ —       │ No subheading at all (post detail — acceptable) │                 
  ├────────────────────────┼─────────┼─────────────────────────────────────────────────┤                 
  │ AboutDetailPreview.jsx │ 70–79   │ Description <p> styled locally                  │                 
  └────────────────────────┴─────────┴─────────────────────────────────────────────────┘                 
                                                                                                       
  C. Missing subheading support when heading is present                                                  
                                                                                                       
  ┌────────────────────────┬──────────────────────────────────────────────────────────────────────────┐  
  │          File          │                                 Problem                                  │
  ├────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
  │ TestimonialPreview.jsx │ data.heading is supported, but data.subheading is not. Builder has no    │
  │                        │ Subheading field either. Inconsistent with Services, Gallery, CTA, etc.  │
  ├────────────────────────┼──────────────────────────────────────────────────────────────────────────┤  
  │ FooterPreview.jsx      │ No heading at all in the section (brand/tagline are different from       │
  │                        │ section heading — probably intentional)                                  │  
  └────────────────────────┴──────────────────────────────────────────────────────────────────────────┘
                                                                                                         
  ---                                                                                                  
  ─── 4. BUILDER STYLE TAB ISSUES ───
                                     
  Standard expected order: BgColor → HeadingColor → VerticalPadding → FontSize → Reset
                                                                                                         
  AnnouncementBuilder
                                                                                                         
  - Missing HeadingColor field (has TextColor instead — acceptable for a bar)                            
  - Padding min/max/step: min=30 max=180 step=10 ✓
                                                                                                         
  NavbarBuilder                                                                                        
                                                                                                         
  - No standard section padding — uses padding as "12px 24px" string; Vertical Padding slider            
  meaninglessly overwrites it with an integer ← padding writes wrong type
  - Padding: parseInt(template.padding ?? 48) — template.padding is "12px 24px", so parseInt("12px 24px")
   = 12. Broken read.                                                                                    
  
  HeroBuilder                                                                                            
                                                                                                       
  - Missing HeadingColor as separate field (TextColor controls both — may be intentional)                
  - Order: BgColor, TextColor, BtnBg, BtnText, EyebrowText, HeadingFontSize, ImagePosition,
  VerticalPadding — FontSize-equivalent (HeadingFontSize) is BEFORE VerticalPadding. Inconsistent order. 
                                                                                                       
  AboutBuilder                                                                                           
                                                                                                       
  - Missing HeadingColor
  - Order: BgColor, TextColor, ButtonBg, ButtonText, FontSize, VerticalPadding — FontSize before Padding
  (wrong order)                                                                                          
  
  ServicesBuilder                                                                                        
                                                                                                       
  - Missing HeadingColor                                                                                 
  - Order: BgColor, TextColor, CardBg, AccentColor, VerticalPadding, FontSize ← FontSize after Padding ✓
                                                                                                         
  CarouselBuilder                                                                                      
                                                                                                         
  - Has Vertical Padding slider — but preview never reads template.padding. Control does nothing.        
  - Missing HeadingColor (carousel slides use textColor for title)
                                                                                                         
  TestimonialBuilder                                                                                   
                                                                                                         
  - visibleCount selector appears FIRST before BgColor — non-standard placement                          
  - Missing HeadingColor
                                                                                                         
  GalleryBuilder                                                                                       

  - Missing HeadingColor
  - Order: BgColor, TextColor, CaptionBg, VerticalPadding, FontSize ✓
                                                                                                         
  CTABuilder
                                                                                                         
  - Missing HeadingColor                                                                               
  - Order: BgColor, TextColor, PrimaryBtnBg, PrimaryBtnText, SecBtnBg, SecBtnText, VerticalPadding,
  FontSize ✓                                                                                             
  
  FooterBuilder                                                                                          
                                                                                                       
  - Missing HeadingColor
  - Order: BgColor, TextColor, LinkColor, VerticalPadding, FontSize ✓
                                                                                                         
  ContactBuilder
                                                                                                         
  - Missing FontSize field entirely                                                                    
  - Missing HeadingColor

  FormBuilder

  - Missing FontSize field                                                                               
  - Missing HeadingColor
                                                                                                         
  SocialMediaBuilder                                                                                   

  - Missing HeadingColor, FontSize

  BlogListBuilder

  - Order: BgColor, TextColor, CardBg, AccentColor, FontSize, VerticalPadding — FontSize before Padding  
  (wrong order)
                                                                                                         
  BlogPostBuilder                                                                                      

  - Missing Reset button (only builder without one)
  - Missing HeadingColor

  AboutDetailBuilder                                                                                     
  
  - Reads/writes template.padding but theme.json has no padding key — padding control does nothing (see  
  §1B)                                                                                                 
  - Custom multi-section layout is fine, but inconsistent with other builders                            
                                                                                                         
  PageBannerBuilder
                                                                                                         
  - Writes to template.padding but preview never reads it — padding control does nothing                 
  
  TeamBuilder                                                                                            
                                                                                                       
  - Writes to template.padding but theme.json stores paddingY — padding control does nothing (see §1B)   
  
  PartnersBuilder                                                                                        
                                                                                                       
  - Order: BgColor ✓, HeadingColor ✓, VerticalPadding ✓ — best-ordered builder                           
  - No FontSize field (Partners doesn't need it much — acceptable)
                                                                                                         
  ---                                                                                                  
  ─── 5. DARK MODE ISSUES ───                                                                            
                                                                                                       
  A. Doesn't import or use useDarkMode

  ┌────────────────────────┬──────────────────────────────────────────────────────────────────────────┐  
  │          File          │               Hardcoded fallbacks that break in dark mode                │
  ├────────────────────────┼──────────────────────────────────────────────────────────────────────────┤  
  │ GalleryPreview.jsx     │ bgColor || '#f9fafb' (light only), textColor || '#111827' (light only)   │
  ├────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
  │ FooterPreview.jsx      │ Intentionally dark footer — bgColor #0f1117, all text #6b7280 —          │  
  │                        │ hardcoded regardless of darkMode toggle                                  │  
  ├────────────────────────┼──────────────────────────────────────────────────────────────────────────┤  
  │ AboutDetailPreview.jsx │ sectionBackground || '#f8f8f8' (light), headingColor || '#111111'        │  
  │                        │ (light), cardBackground || '#ffffff' (light) — all light-only fallbacks  │  
  ├────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
  │ TeamPreview.jsx        │ sectionBackground || '#ffffff' (light), headingColor || '#111111'        │  
  │                        │ (light) — all light-only fallbacks                                       │
  ├────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
  │ PageBannerPreview.jsx  │ Always-dark banner (intentional) — no issue in practice                  │
  └────────────────────────┴──────────────────────────────────────────────────────────────────────────┘  
  
  B. Wrong dark mode fallback value                                                                      
                                                                                                       
  ┌────────────────────┬──────┬──────────────────────────────────────────────────────────────────┐
  │        File        │ Line │                             Problem                              │
  ├────────────────────┼──────┼──────────────────────────────────────────────────────────────────┤
  │ GalleryPreview.jsx │ 39   │ bgColor || '#f9fafb' — no darkMode ? '#18181b' : '#f9fafb' guard │
  ├────────────────────┼──────┼──────────────────────────────────────────────────────────────────┤
  │ GalleryPreview.jsx │ 33   │ textColor || '#111827' — no dark mode guard                      │       
  └────────────────────┴──────┴──────────────────────────────────────────────────────────────────┘       
                                                                                                         
  ---                                                                                                    
  ─── 6. THEME.JSON ISSUES ───                                                                         
                                                                                                         
  A. Wrong/missing padding key                                                                         

  ┌─────────────┬────────────────────────────────────────┬───────────────────────────┬────────────────┐  
  │   Section   │             theme.json key             │   Builder/Preview uses    │     Result     │
  ├─────────────┼────────────────────────────────────────┼───────────────────────────┼────────────────┤  
  │             │                                        │                           │ Key mismatch — │
  │ team        │ paddingY: "80"                         │ template.padding          │  padding never │
  │             │                                        │                           │  applied       │  
  ├─────────────┼────────────────────────────────────────┼───────────────────────────┼────────────────┤  
  │             │                                        │                           │ Key mismatch — │  
  │ aboutDetail │ contentTopSpacing/contentBottomSpacing │ template.padding          │  padding never │  
  │             │                                        │                           │  applied       │
  ├─────────────┼────────────────────────────────────────┼───────────────────────────┼────────────────┤
  │ carousel    │ (no padding key)                       │ template.padding (builder │ Dead field     │  
  │             │                                        │  writes, preview ignores) │                │
  ├─────────────┼────────────────────────────────────────┼───────────────────────────┼────────────────┤  
  │ pageBanner  │ (no padding key)                       │ template.padding (builder │ Dead field     │
  │             │                                        │  writes, preview ignores) │                │
  ├─────────────┼────────────────────────────────────────┼───────────────────────────┼────────────────┤  
  │             │                                        │ parseInt(template.padding │ parseInt("12px │
  │ navbar      │ padding: "12px 24px" (string)          │  ?? 48)                   │  24px") = 12,  │  
  │             │                                        │                           │ slider broken  │
  └─────────────┴────────────────────────────────────────┴───────────────────────────┴────────────────┘  
  
  B. Missing sections in theme.json entirely                                                             
                                                                                                       
  ┌────────────────────────┬─────────────────────────────────────────────────────────────────────────┐   
  │  Section key used in   │                              In theme.json                              │
  │          code          │                                                                         │   
  ├────────────────────────┼─────────────────────────────────────────────────────────────────────────┤ 
  │ theme.socialmedia      │ NOT FOUND — SocialMediaPreview and SocialMediaBuilder will crash or use │
  │                        │  defaults                                                               │   
  ├────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
  │ theme.bloglist         │ NOT FOUND — BlogListBuilder/BlogListPreview will crash or use defaults  │   
  └────────────────────────┴─────────────────────────────────────────────────────────────────────────┘   
  
  (These may be initialized by the store's defaults — but the data is not persisted to theme.json)       
                                                                                                       
  C. Missing bgColor or headingColor in template                                                         
                                                                                                       
  ┌──────────────────────┬────────────────────────────────────────────────────────────────────────────┐  
  │       Section        │                                  Missing                                   │
  ├──────────────────────┼────────────────────────────────────────────────────────────────────────────┤  
  │ team.template        │ Has headingColor ✓ but NO bgColor key — preview would always fall to       │
  │                      │ dark/light default                                                         │
  ├──────────────────────┼────────────────────────────────────────────────────────────────────────────┤  
  │ aboutDetail.template │ Has headingColor ✓, sectionBackground ✓ — OK structurally but uses         │
  │                      │ non-standard key names                                                     │  
  ├──────────────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ pageBanner.template  │ Has headingColor ✓ but no bgColor — no section background control (banner  │  
  │                      │ uses bg image)                                                             │  
  └──────────────────────┴────────────────────────────────────────────────────────────────────────────┘
                                                                                                         
  ---                                                                                                  
  ─── 7. MISSING CONSTANTS ───
                                                                                                         
  A. Uses hardcoded horizontal padding instead of SECTION_PADDING_X / SECTION_PADDING_X_MOBILE
                                                                                                         
  ┌────────────────────────┬────────────────────────────────────┬────────────────────────────────────┐ 
  │          File          │          Hardcoded value           │             Should use             │   
  ├────────────────────────┼────────────────────────────────────┼────────────────────────────────────┤ 
  │ HeroPreview.jsx        │ '56px' / '20px' (lines 40–41)      │ SECTION_PADDING_X /                │ 
  │                        │                                    │ SECTION_PADDING_X_MOBILE           │ 
  ├────────────────────────┼────────────────────────────────────┼────────────────────────────────────┤   
  │ AboutPreview.jsx       │ padH = isMobile ? '16px' : '48px'  │ SECTION_PADDING_X_MOBILE /         │   
  │                        │ (line 29)                          │ SECTION_PADDING_X                  │   
  ├────────────────────────┼────────────────────────────────────┼────────────────────────────────────┤   
  │ CTAPreview.jsx         │ '32px' / '20px' inside shorthand   │ Split + constants                  │ 
  │                        │ padding (line 24)                  │                                    │   
  ├────────────────────────┼────────────────────────────────────┼────────────────────────────────────┤ 
  │ FooterPreview.jsx      │ '48px' in wrapStyle and            │ SECTION_PADDING_X                  │   
  │                        │ bottomBarStyle (lines 32, 111)     │                                    │   
  ├────────────────────────┼────────────────────────────────────┼────────────────────────────────────┤ 
  │ ContactPreview.jsx     │ '32px' in padding template literal │ SECTION_PADDING_X                  │   
  │                        │  (line 78)                         │                                    │   
  ├────────────────────────┼────────────────────────────────────┼────────────────────────────────────┤
  │ FormPreview.jsx        │ '32px' / '20px' in padding (line   │ Split + constants                  │   
  │                        │ 32)                                │                                    │ 
  ├────────────────────────┼────────────────────────────────────┼────────────────────────────────────┤
  │ SocialMediaPreview.jsx │ '32px' / '20px' in padding (line   │ Split + constants                  │   
  │                        │ 95)                                │                                    │
  ├────────────────────────┼────────────────────────────────────┼────────────────────────────────────┤   
  │ BlogListPreview.jsx    │ '32px' in padding (line 34)        │ SECTION_PADDING_X                  │ 
  ├────────────────────────┼────────────────────────────────────┼────────────────────────────────────┤   
  │ BlogPostPreview.jsx    │ '32px' in padding (line 81)        │ SECTION_PADDING_X                  │
  ├────────────────────────┼────────────────────────────────────┼────────────────────────────────────┤   
  │ PartnersPreview.jsx    │ '24px' left/right (lines 62–63)    │ SECTION_PADDING_X                  │ 
  ├────────────────────────┼────────────────────────────────────┼────────────────────────────────────┤   
  │ TeamPreview.jsx        │ Extra '0 32px' on inner div (line  │ Remove — double padding            │ 
  │                        │ 98)                                │                                    │   
  ├────────────────────────┼────────────────────────────────────┼────────────────────────────────────┤ 
  │ AboutDetailPreview.jsx │ Extra '0 32px' on inner div (line  │ Remove — double padding            │   
  │                        │ 49)                                │                                    │   
  └────────────────────────┴────────────────────────────────────┴────────────────────────────────────┘
                                                                                                         
  B. Doesn't import CONTENT_MAX_WIDTH where it's needed                                                

  ┌───────────────────────┬───────────────────────────────────────────────────────────────────────────┐
  │         File          │                                   Issue                                   │
  ├───────────────────────┼───────────────────────────────────────────────────────────────────────────┤  
  │ CarouselPreview.jsx   │ No innerStyle — full-width is intentional, but carousel text content      │
  │                       │ (title/subtitle) has no max-width constraint                              │  
  ├───────────────────────┼───────────────────────────────────────────────────────────────────────────┤  
  │ PageBannerPreview.jsx │ Text is centered via flexbox with padding: '0 32px' — no                  │
  │                       │ CONTENT_MAX_WIDTH. Acceptable for a banner.                               │  
  └───────────────────────┴───────────────────────────────────────────────────────────────────────────┘
                                                                                                         
  ---                                                                                                  
  ─── PRIORITY ORDER FOR FIXING ───
                                                                                                         
  🔴 P0 — Broken / does nothing (fix immediately)
                                                                                                         
  1. team paddingY → padding key mismatch — TeamBuilder's Vertical Padding control does nothing. Fix:    
  rename paddingY to padding in theme.json OR update builder/preview to use paddingY.                    
  2. aboutDetail missing padding key — AboutDetailBuilder's Vertical Padding control does nothing. Fix:  
  add padding key to theme.json aboutDetail.template.                                                    
  3. carousel builder writes padding, preview ignores it — remove the misleading slider from
  CarouselBuilder.                                                                                       
  4. pageBanner builder writes padding, preview ignores it — remove the misleading slider from         
  PageBannerBuilder.                                                                                     
  5. navbar padding is a string "12px 24px", parseInt() on it yields 12 — builder slider is broken. Fix:
  make navbar padding numeric (vertical only) and move horizontal to constants.                          
  6. CTAPreview/FooterPreview: template.padding (number) used as CSS padding with no px — invisible CSS
  bug causing no actual padding change.                                                                  
                                                                                                       
  🟠 P1 — Dark mode broken for some sections                                                             
                                                                                                       
  7. GalleryPreview — no useDarkMode, hardcoded light-only fallbacks. Breaks in dark mode.               
  8. TeamPreview — no useDarkMode, hardcoded light-only fallbacks.                                     
  9. AboutDetailPreview — no useDarkMode, hardcoded light-only fallbacks.                                
                                                                                                       
  🟡 P2 — Double padding (visual defect, easy fix)                                                       
                                                                                                       
  10. TeamPreview inner padding: '0 32px' — remove; outer section already has SECTION_PADDING_X.         
  11. AboutDetailPreview inner padding: '0 32px' — same.                                               
                                                                                                         
  🟡 P3 — Hardcoded horizontal padding (inconsistency / maintenance)                                     
  
  12. Standardize all previews that hardcode 32px/48px/56px horizontal padding to use SECTION_PADDING_X /
   SECTION_PADDING_X_MOBILE and split the shorthand into separate paddingTop/Bottom/Left/Right. Affects:
  Hero, About, CTA, Footer, Contact, Form, SocialMedia, BlogList, BlogPost, Partners.                    
                                                                                                       
  🟢 P4 — Missing heading/subheading utility usage                                                       
  
  13. CarouselPreview — use headingStyle()/subheadingStyle() for slide title/subtitle.                   
  14. TestimonialPreview — add data.subheading support (builder field + preview render).               
  15. AboutDetailPreview / PageBannerPreview — use headingStyle() for section headings.                  
                                                                                                         
  🟢 P5 — Builder field order & missing fields                                                           
                                                                                                         
  16. Add HeadingColor to builders that are missing it: Announcement, Hero, About, Services, Carousel,   
  Testimonial, Gallery, CTA, Footer, SocialMedia, BlogPost.                                            
  17. Add FontSize to: Contact, Form, SocialMedia.                                                       
  18. Add Reset button to BlogPostBuilder.                                                             
  19. Fix field order in: About (FontSize before Padding), BlogList (FontSize before Padding).           
  20. Move visibleCount selector in TestimonialBuilder to after the color fields.                        
                                                                                                         
  🟢 P6 — theme.json cleanup                                                                             
                                                                                                         
  21. Add socialMedia and blogList template defaults to theme.json (if the store doesn't already write   
  them on first use).                                                                                  
  22. Add padding to carousel.template or remove the builder control.                                    
                                                                                                         
✻ Cogitated for 4m 18s





// prompt for making it right 

Read these files first:
- src/data/theme.json
- src/components/previews/CTAPreview.jsx
- src/components/previews/FooterPreview.jsx
- src/components/previews/TeamPreview.jsx
- src/components/previews/AboutDetailPreview.jsx
- src/components/previews/GalleryPreview.jsx
- src/components/previews/CarouselPreview.jsx
- src/components/previews/NavbarPreview.jsx
- src/components/builders/CarouselBuilder.jsx
- src/components/builders/PageBannerBuilder.jsx
- src/components/builders/NavbarBuilder.jsx

Then make ALL of these fixes:

─── P0 FIXES ───

1. theme.json — team.template:
   Rename paddingY to padding. Keep the value (convert "80" to 48 to match standard default).

2. theme.json — aboutDetail.template:
   Add "padding": 48. Remove contentTopSpacing and contentBottomSpacing keys.

3. theme.json — navbar.template:
   Change padding from "12px 24px" to 12 (integer, vertical only).

4. CarouselBuilder.jsx:
   Remove the Vertical Padding RangeField entirely from the style tab.
   Carousel uses template.height for sizing — padding is not applicable.

5. PageBannerBuilder.jsx:
   Remove the Vertical Padding RangeField from the style tab.
   PageBanner uses bannerHeight — padding is not applicable.

6. NavbarBuilder.jsx:
   Fix the Vertical Padding RangeField to use:
   value={parseInt(template.padding ?? 12)}
   onChange={v => handleTemplate('padding', parseInt(v))}
   min={8} max={40} step={2} unit="px"
   (Navbar padding range is smaller than content sections)

7. CTAPreview.jsx:
   Fix sectionStyle padding from shorthand to:
   paddingTop: `${parseInt(template.padding ?? 48)}px`,
   paddingBottom: `${parseInt(template.padding ?? 48)}px`,
   paddingLeft: isMobile ? `${SECTION_PADDING_X_MOBILE}px` : `${SECTION_PADDING_X}px`,
   paddingRight: isMobile ? `${SECTION_PADDING_X_MOBILE}px` : `${SECTION_PADDING_X}px`,
   Import SECTION_PADDING_X and SECTION_PADDING_X_MOBILE from src/constants/design.js.
   Add useContainerWidth and isMobile if not present.

8. FooterPreview.jsx:
   Same padding fix as CTA — split shorthand into separate paddingTop/Bottom/Left/Right.
   Use SECTION_PADDING_X constants for horizontal.

─── P1 FIXES (dark mode — since we're removing dark mode from previews, just normalize fallbacks) ───

9. GalleryPreview.jsx:
   Replace all darkMode ternaries with light-mode values only:
   bgColor fallback → '#f9fafb'
   textColor fallback → '#111827'
   Remove useDarkMode import and usage.

10. TeamPreview.jsx:
    Replace all darkMode ternaries with light-mode values:
    sectionBackground fallback → '#ffffff'
    headingColor fallback → '#111111'
    Remove useDarkMode import and usage if present.

11. AboutDetailPreview.jsx:
    Replace all darkMode ternaries with light-mode values:
    sectionBackground fallback → '#f8f8f8'
    headingColor fallback → '#111111'
    cardBackground fallback → '#ffffff'
    Remove useDarkMode import and usage if present.

─── P2 FIXES (double padding) ───

12. TeamPreview.jsx inner wrapper div:
    Remove padding: '0 32px' from the inner content div (the one with maxWidth: CONTENT_MAX_WIDTH).
    The outer section already provides horizontal padding via SECTION_PADDING_X.

13. AboutDetailPreview.jsx inner wrapper div:
    Same — remove padding: '0 32px' from the inner content div.

─── theme.json final cleanup ───

14. In theme.json, ensure these sections have padding: 48 in their template:
    cta, footer, contact, form, socialmedia, bloglist, blogPost, gallery, services, testimonial, about, announcement
    Add padding: 48 wherever the key is missing. Do not change existing correct values.

Print a summary table of every change made per file.