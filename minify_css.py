import re

def minify_css(input_file, output_file):
    try:
        with open(input_file, 'r') as f:
            css = f.read()

        # Remove comments
        css = re.sub(r'/\*[\s\S]*?\*/', '', css)
        
        # Remove whitespace around special characters
        css = re.sub(r'\s*([:;{}])\s*', r'\1', css)
        
        # Remove newlines and extra spaces
        css = css.replace('\n', '').replace('\r', '')
        css = re.sub(r'\s+', ' ', css)
        
        # Remove final semicolon in blocks (optional but standard)
        css = re.sub(r';}', '}', css)

        with open(output_file, 'w') as f:
            f.write(css)
            
        print(f"Minified {input_file} -> {output_file}")
        
    except Exception as e:
        print(f"Error minifying CSS: {e}")

if __name__ == "__main__":
    base_dir = r"c:\Dev\Resume\RenegadeJayhawk.github.io\RenegadeJayhawk.github.io\RenegadeJayhawk.github.io"
    input_path = f"{base_dir}\\styles.css"
    output_path = f"{base_dir}\\styles.min.css"
    minify_css(input_path, output_path)
