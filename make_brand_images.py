from PIL import Image, ImageDraw, ImageFont
import os, glob
LOGO="public/logo.png"; OUT_OG="app/opengraph-image.png"; OUT_PROFILE="whatsapp-profile.png"
def find_font(bold):
    pref=(["arialbd.ttf","segoeuib.ttf","DejaVuSans-Bold.ttf"] if bold else ["arial.ttf","segoeui.ttf","DejaVuSans.ttf"])
    dirs=[r"C:\Windows\Fonts","/Library/Fonts","/System/Library/Fonts/Supplemental","/usr/share/fonts/truetype/dejavu","/usr/share/fonts"]
    for d in dirs:
        for n in pref:
            if os.path.exists(os.path.join(d,n)): return os.path.join(d,n)
    for d in dirs:
        g=glob.glob(os.path.join(d,"**","*.ttf"),recursive=True)
        if g: return g[0]
    raise SystemExit("Nessun font TTF trovato")
BOLD=find_font(True); REG=find_font(False)
COP,FG,MUT,BG=(217,119,6),(11,15,20),(107,114,128),(250,249,246)
logo=Image.open(LOGO).convert("RGBA"); logo=logo.crop(logo.getbbox())
W,Hh=1200,630; og=Image.new("RGB",(W,Hh),BG); d=ImageDraw.Draw(og)
th=430; s=th/logo.height; L=logo.resize((int(logo.width*s),th),Image.LANCZOS)
lx=72; og.paste(L,(lx,(Hh-th)//2),L)
tx=lx+L.width+56; avail=W-tx-60
l1,l2,dom="Your Italian address.","Anywhere in the world.","italparcel.com"
wd=lambda f,t: d.textbbox((0,0),t,font=f)[2]
htf=lambda f,t: d.textbbox((0,0),t,font=f)[3]-d.textbbox((0,0),t,font=f)[1]
sz=58
while sz>28 and max(wd(ImageFont.truetype(BOLD,sz),x) for x in (l1,l2))>avail: sz-=2
HB=ImageFont.truetype(BOLD,sz); RF=ImageFont.truetype(REG,32)
g1,g2=16,40; H1,H2,H3=htf(HB,l1),htf(HB,l2),htf(RF,dom); ty=(Hh-(H1+g1+H2+g2+H3))//2
d.text((tx,ty),l1,font=HB,fill=FG); d.text((tx,ty+H1+g1),l2,font=HB,fill=COP)
d.text((tx,ty+H1+g1+H2+g2),dom,font=RF,fill=MUT); d.rectangle([0,Hh-14,W,Hh],fill=COP)
og.save(OUT_OG); print("OG:",OUT_OG)
S=1080; sc=(S*0.99)/max(logo.width,logo.height)
LS=logo.resize((int(logo.width*sc),int(logo.height*sc)),Image.LANCZOS)
cv=Image.new("RGB",(S,S),(255,255,255)); cv.paste(LS,((S-LS.width)//2,(S-LS.height)//2),LS)
cv.save(OUT_PROFILE); print("Profilo:",OUT_PROFILE)
