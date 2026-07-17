class ProgressGenerator:

    @staticmethod
    def upload():

        return {

            "stage": "upload",

            "message": "Repository uploaded successfully."

        }


    @staticmethod
    def analyze():

        return {

            "stage": "analysis",

            "message": "Analyzing repository..."

        }


    @staticmethod
    def technology():

        return {

            "stage": "technology",

            "message": "Detecting technology stack..."

        }


    @staticmethod
    def architecture():

        return {

            "stage": "architecture",

            "message": "Understanding architecture..."

        }


    @staticmethod
    def components():

        return {

            "stage": "components",

            "message": "Finding important components..."

        }


    @staticmethod
    def batch1():

        return {

            "stage": "generation",

            "message": "Generating Introduction..."

        }


    @staticmethod
    def batch2():

        return {

            "stage": "generation",

            "message": "Generating Technology Stack..."

        }


    @staticmethod
    def batch3():

        return {

            "stage": "generation",

            "message": "Generating Repository Guide..."

        }


    @staticmethod
    def completed():

        return {

            "stage": "completed",

            "message": "Documentation generated successfully."

        }