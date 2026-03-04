import { useEffect } from "react";

interface OpenGraphTagsProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

export default function OpenGraphTags({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  tags,
}: OpenGraphTagsProps) {
  useEffect(() => {
    // Set document title
    document.title = `${title} | CXO for Startups`;

    // Helper function to set or update meta tags
    const setMetaTag = (property: string, content: string, isName = false) => {
      const attribute = isName ? "name" : "property";
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    // Basic meta tags
    setMetaTag("description", description, true);

    // Open Graph tags
    setMetaTag("og:title", title);
    setMetaTag("og:description", description);
    setMetaTag("og:type", type);
    
    if (url) {
      setMetaTag("og:url", url);
    }
    
    if (image) {
      setMetaTag("og:image", image);
      setMetaTag("og:image:width", "1200");
      setMetaTag("og:image:height", "630");
    } else {
      // Use default OG image
      const defaultImage = `${window.location.origin}/CXOlogo.png`;
      setMetaTag("og:image", defaultImage);
    }

    // Twitter Card tags
    setMetaTag("twitter:card", image ? "summary_large_image" : "summary", true);
    setMetaTag("twitter:title", title, true);
    setMetaTag("twitter:description", description, true);
    
    if (image) {
      setMetaTag("twitter:image", image, true);
    }

    // Article-specific tags
    if (type === "article") {
      if (publishedTime) {
        setMetaTag("article:published_time", publishedTime);
      }
      if (modifiedTime) {
        setMetaTag("article:modified_time", modifiedTime);
      }
      if (author) {
        setMetaTag("article:author", author);
      }
      if (tags && tags.length > 0) {
        // Remove existing article:tag meta tags
        document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
        // Add new tags
        tags.forEach(tag => {
          const tagElement = document.createElement("meta");
          tagElement.setAttribute("property", "article:tag");
          tagElement.setAttribute("content", tag);
          document.head.appendChild(tagElement);
        });
      }
    }

    // Cleanup function to remove meta tags when component unmounts
    return () => {
      // We don't remove meta tags on unmount to avoid flickering
      // They will be updated by the next page's OpenGraphTags component
    };
  }, [title, description, image, url, type, publishedTime, modifiedTime, author, tags]);

  // This component doesn't render anything
  return null;
}
