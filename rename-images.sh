#!/bin/bash
# Image Rename Script for SEO
# Run from your matt-simpson-photography root directory
# IMPORTANT: Review and customize the gallery image names before running!
# 
# After running this script, all template references will already be updated
# (from the v4 zip). Just commit and push.

echo "Renaming images for SEO..."

cd static/images

# === HOMEPAGE & SHARED IMAGES ===
mv aboutme.jpg matt-simpson-photographer-louisville-ky.jpg 2>/dev/null
mv headshot.jpg professional-headshot-louisville-ky.jpg 2>/dev/null
mv event1.jpg louisville-event-photography-conference.jpg 2>/dev/null
mv brand1.jpg commercial-photography-louisville-brand.jpg 2>/dev/null
mv brand2.jpg commercial-photography-louisville-marketing.jpg 2>/dev/null
mv story.jpg storyfest-louisville-event-coverage.jpg 2>/dev/null
mv talespin.jpg talespin-ale-fest-louisville-photography.jpg 2>/dev/null
mv perfumery.jpg the-perfumery-product-photography-louisville.jpg 2>/dev/null
mv current.jpg current812-apartment-brand-photography-jeffersonville.jpg 2>/dev/null
mv kaz.jpg headshot-photography-louisville-testimonial.jpg 2>/dev/null

# === HEADSHOT GALLERY ===
mv hs1.jpg headshot-executive-man-gray-suit-louisville.jpg 2>/dev/null
mv hs2.jpg headshot-creative-professional-dark-background-louisville.jpg 2>/dev/null
mv hs3.jpg headshot-corporate-woman-red-top-louisville.jpg 2>/dev/null
mv hs4.jpg headshot-business-casual-man-plaid-louisville.jpg 2>/dev/null
mv hs5.jpg headshot-professional-woman-black-blazer-louisville.jpg 2>/dev/null
mv hs6.jpg headshot-linkedin-portrait-woman-louisville.jpg 2>/dev/null
mv hs7.jpg headshot-executive-blue-blazer-brick-louisville.jpg 2>/dev/null
mv hs8.jpg headshot-branding-portrait-natural-light-germantown.jpg 2>/dev/null
mv hs9.jpg headshot-professional-portrait-louisville-studio.jpg 2>/dev/null

# === EVENT GALLERY ===
mv event2.jpg event-photography-louisville-festival-stage-crowd.jpg 2>/dev/null
mv event3.jpg event-photography-louisville-family-community.jpg 2>/dev/null
mv event4.jpg event-photography-louisville-food-vendor.jpg 2>/dev/null
mv event5.jpg event-photography-louisville-speaker-podium.jpg 2>/dev/null
mv event6.jpg event-photography-louisville-festival-cornhole.jpg 2>/dev/null
mv event7.jpg event-photography-louisville-kids-foam-party.jpg 2>/dev/null
mv event8.jpg event-photography-louisville-conference-speaker.jpg 2>/dev/null
mv event9.jpg event-photography-louisville-outdoor-tent-reception.jpg 2>/dev/null
mv event10.jpg event-photography-louisville-corporate-networking.jpg 2>/dev/null
mv event11.jpg event-photography-louisville-gala-dinner.jpg 2>/dev/null

# === COMMERCIAL/BRANDING GALLERY ===
cd branding
mv branding1.jpg commercial-product-photography-louisville-1.jpg 2>/dev/null
mv branding2.jpg commercial-lifestyle-photography-louisville-2.jpg 2>/dev/null
mv branding3.jpg commercial-brand-photography-louisville-3.jpg 2>/dev/null
mv branding4.jpg commercial-marketing-photography-louisville-4.jpg 2>/dev/null
mv branding5.jpg commercial-corporate-photography-louisville-5.jpg 2>/dev/null
mv branding6.jpg commercial-business-photography-louisville-6.jpg 2>/dev/null
mv branding7.jpg commercial-content-photography-louisville-7.jpg 2>/dev/null
mv branding8.jpg commercial-campaign-photography-louisville-8.jpg 2>/dev/null
mv branding9.jpg commercial-editorial-photography-louisville-9.jpg 2>/dev/null
mv branding10.jpg commercial-website-photography-louisville-10.jpg 2>/dev/null
cd ..

echo "Done! Now commit and push."
echo ""
echo "REMINDER: Edit the gallery filenames above to match what's actually"
echo "in each photo before running. Generic names are placeholders."
