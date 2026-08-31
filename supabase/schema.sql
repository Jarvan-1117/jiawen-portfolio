-- Run this in Supabase SQL Editor.
-- Replace jiawen.wang1117@gmail.com with the email you will use to log in at /admin.

create extension if not exists pgcrypto;

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'jiawen.wang1117@gmail.com';
$$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  long_description text,
  year text,
  category text,
  tags text[] default '{}',
  tech_stack text[] default '{}',
  cover_image text,
  gallery_images text[] default '{}',
  project_url text,
  featured boolean default false,
  visible boolean default true,
  sort_order integer default 0,
  problem text,
  dataset text,
  approach text,
  models text,
  evaluation text,
  results text,
  learned text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  key text not null unique,
  value text,
  updated_at timestamptz default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) between 3 and 254),
  organization text check (organization is null or char_length(organization) <= 100),
  subject text not null check (char_length(subject) between 2 and 120),
  message text not null check (char_length(message) between 20 and 2000),
  status text not null default 'new' check (status in ('new', 'contacted', 'archived')),
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
before update on public.projects
for each row execute function public.touch_updated_at();

drop trigger if exists site_content_touch_updated_at on public.site_content;
create trigger site_content_touch_updated_at
before update on public.site_content
for each row execute function public.touch_updated_at();

alter table public.projects enable row level security;
alter table public.site_content enable row level security;
alter table public.contact_messages enable row level security;

revoke all on table public.contact_messages from anon, authenticated;
grant insert on table public.contact_messages to anon, authenticated;
grant select, update, delete on table public.contact_messages to authenticated;

drop policy if exists "Public can submit contact messages" on public.contact_messages;
create policy "Public can submit contact messages"
on public.contact_messages for insert
to anon, authenticated
with check (
  status = 'new'
  and char_length(name) between 2 and 80
  and char_length(email) between 3 and 254
  and char_length(subject) between 2 and 120
  and char_length(message) between 20 and 2000
);

drop policy if exists "Admin can read contact messages" on public.contact_messages;
create policy "Admin can read contact messages"
on public.contact_messages for select
to authenticated
using (public.is_portfolio_admin());

drop policy if exists "Admin can update contact messages" on public.contact_messages;
create policy "Admin can update contact messages"
on public.contact_messages for update
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

drop policy if exists "Admin can delete contact messages" on public.contact_messages;
create policy "Admin can delete contact messages"
on public.contact_messages for delete
to authenticated
using (public.is_portfolio_admin());

drop policy if exists "Public can read visible projects" on public.projects;
create policy "Public can read visible projects"
on public.projects for select
using (visible = true or public.is_portfolio_admin());

drop policy if exists "Admin can insert projects" on public.projects;
create policy "Admin can insert projects"
on public.projects for insert
with check (public.is_portfolio_admin());

drop policy if exists "Admin can update projects" on public.projects;
create policy "Admin can update projects"
on public.projects for update
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

drop policy if exists "Admin can delete projects" on public.projects;
create policy "Admin can delete projects"
on public.projects for delete
using (public.is_portfolio_admin());

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
on public.site_content for select
using (true);

drop policy if exists "Admin can insert site content" on public.site_content;
create policy "Admin can insert site content"
on public.site_content for insert
with check (public.is_portfolio_admin());

drop policy if exists "Admin can update site content" on public.site_content;
create policy "Admin can update site content"
on public.site_content for update
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

drop policy if exists "Admin can delete site content" on public.site_content;
create policy "Admin can delete site content"
on public.site_content for delete
using (public.is_portfolio_admin());

insert into public.site_content (section, key, value)
values
  ('homepage', 'homepageEyebrow', 'Jiawen (Jarvan) Wang'),
  ('homepage', 'homepageTitle', 'Data Analytics / Machine Learning'),
  ('homepage', 'homepageIntro', 'Master of Information Technology student at UTS focused on data analytics and applied machine learning. I use Python, SQL, Pandas, and scikit-learn to prepare data, explore patterns, and build reproducible predictive workflows.'),
  ('homepage', 'heroImage', '/jiawen-profile.png'),
  ('homepage', 'heroImageCaption', 'Jiawen Wang with a kitten'),
  ('about', 'aboutTitle', 'Turning complex data into clear analysis and practical models.'),
  ('about', 'aboutBody1', 'I am currently studying the Master of Information Technology at the University of Technology Sydney, focusing on data analytics and applied machine learning. My biotechnology background also gives me a useful foundation for working with healthcare and scientific data.'),
  ('about', 'aboutBody2', 'I enjoy the full data workflow: cleaning and exploring data, engineering useful features, evaluating models, and communicating results clearly enough to support the next decision.'),
  ('projects', 'projectsTitle', 'Selected data analytics and machine learning projects, from data preparation and exploration to evaluated models.'),
  ('skills', 'skillsTitle', 'Data analysis, modelling, and the tools behind the workflow.'),
  ('education', 'educationTitle', 'Combining data and technology training with a foundation in biotechnology.'),
  ('about', 'focusAreas', '["Data Analytics","Applied Machine Learning","Data Preparation","Exploratory Analysis","Computer Vision","Model Evaluation"]'),
  ('about', 'quickStats', '[{"label":"Current degree","value":"MIT at UTS"},{"label":"Main focus","value":"Data Analytics"},{"label":"Workflow mindset","value":"End to end"},{"label":"Location","value":"Sydney"}]'),
  ('skills', 'skillGroups', '[{"title":"Data Analytics & Programming","skills":["Python","SQL","Pandas","NumPy","Data Cleaning","Exploratory Data Analysis","Matplotlib","Seaborn","Jupyter Notebook"]},{"title":"Machine Learning","skills":["Scikit-learn","Supervised Learning","Classification","Feature Engineering","Cross-validation","Model Evaluation","Error Analysis"]},{"title":"Deep Learning / Computer Vision","skills":["PyTorch","CNN","ResNet18","Faster R-CNN","SSD300","OpenCV","Object Detection","Image Classification"]},{"title":"Tools & Languages","skills":["Git","GitHub","VS Code","English","Mandarin Chinese"]}]'),
  ('education', 'education', '[{"school":"University of Technology Sydney","degree":"Master of Information Technology","period":"2025 - Present","coursework":["Database","Data Analytics","Advanced Data Analytics Algorithms","Project Management","Software Development"]},{"school":"Huazhong Agricultural University","degree":"Bachelor of Biotechnology","period":"2019 - 2023","coursework":["Microbiology","Cell Biology","Genetics","Biochemistry","Genetic Engineering","Pharmacology"]}]'),
  ('contact', 'contactTitle', 'Let''s connect about data analytics and applied machine learning.'),
  ('contact', 'contactEmail', ''),
  ('contact', 'location', 'Sydney, Australia'),
  ('contact', 'githubUrl', 'https://github.com/Jarvan-1117'),
  ('contact', 'linkedinUrl', 'https://www.linkedin.com/in/jiawen-wang1117/'),
  ('contact', 'instagramUrl', ''),
  ('global', 'footerText', 'Jiawen (Jarvan) Wang. Built with Next.js, TypeScript, and Tailwind CSS.')
on conflict (key) do update set value = excluded.value, section = excluded.section;

insert into public.projects (
  title, slug, description, long_description, category, tags, tech_stack, featured, visible, sort_order,
  problem, dataset, approach, models, evaluation, results, learned
)
values
  (
    'Deep Learning for Image Classification & Object Detection',
    'deep-learning-for-image-classification-object-detection',
    'Built PyTorch pipelines for image classification and object detection, comparing ResNet18 variants and visualizing predictions for debugging.',
    'Built PyTorch pipelines for image classification and object detection, comparing ResNet18 variants and visualizing predictions for debugging.',
    'Computer Vision',
    array['Computer Vision', 'Deep Learning', 'PyTorch', 'Object Detection'],
    array['PyTorch', 'ResNet18', 'Faster R-CNN', 'SSD300'],
    false,
    true,
    3,
    'Develop reliable workflows for both classification and object detection tasks, with enough diagnostics to understand model behavior.',
    'Image datasets prepared for classification and object detection experiments.',
    'Implemented training and validation loops, compared baseline and customized ResNet18 architectures, and inspected visual predictions.',
    'ResNet18 for image classification; Faster R-CNN and SSD300 for object detection.',
    'Used training and validation metrics alongside visual review of predictions and bounding boxes to compare model behavior.',
    'Established reusable training and evaluation workflows for classification and detection, supported by visual diagnostics for error analysis.',
    'Model evaluation is strongest when quantitative metrics and qualitative error analysis are used together.'
  ),
  (
    'Handwritten Mathematical Symbol Recognition',
    'handwritten-mathematical-symbol-recognition',
    'Engineered HOG, LBP, and raw-pixel features, then trained classifiers to analyze multi-class symbol recognition errors.',
    'Engineered HOG, LBP, and raw-pixel features, then trained classifiers to analyze multi-class symbol recognition errors.',
    'Computer Vision',
    array['Computer Vision', 'Feature Engineering', 'SVM', 'OpenCV'],
    array['Python', 'Scikit-learn', 'OpenCV', 'HOG', 'LBP'],
    false,
    true,
    2,
    'Classify handwritten mathematical symbols where shape variation and visual similarity can cause confusion between classes.',
    'Handwritten mathematical symbol samples represented with raw pixels, HOG, and LBP features.',
    'Created raw-pixel, HOG, and LBP feature representations, then compared classifier behavior across feature sets.',
    'Support Vector Machine and Artificial Neural Network classifiers.',
    'Compared accuracy and confusion matrices to identify recurring misclassification patterns across feature sets.',
    'The comparison showed how feature representation affected classifier behavior and made common symbol confusions easier to inspect.',
    'Feature design can make classical machine learning models much more interpretable for visual recognition tasks.'
  ),
  (
    'Cardiovascular Disease Prediction',
    'cardiovascular-disease-prediction',
    'Cleaned and explored more than 56,000 medical records, engineered features, and compared predictive models using consistent evaluation criteria.',
    'Cleaned and explored more than 56,000 medical records, engineered features, and compared predictive models using consistent evaluation criteria.',
    'Healthcare',
    array['Machine Learning', 'Healthcare', 'Data Analytics', 'Scikit-learn'],
    array['Python', 'Scikit-learn', 'Pandas', 'NumPy'],
    true,
    true,
    0,
    'Predict cardiovascular disease risk from structured medical records while keeping the workflow inspectable.',
    'More than 56,000 medical records with structured health-related features.',
    'Cleaned and explored the dataset, prepared model-ready features, and compared models using a consistent evaluation workflow.',
    'Logistic Regression, Random Forest, and K-Nearest Neighbors.',
    'Compared accuracy, F1-score, and ROC-AUC to evaluate performance from complementary perspectives.',
    'Produced a structured comparison of Logistic Regression, Random Forest, and K-Nearest Neighbors, with emphasis on interpretable evaluation and model trade-offs.',
    'Healthcare prediction workflows require careful preprocessing, clear evaluation, and restraint when communicating results.'
  ),
  (
    'SMS Spam Classification',
    'sms-spam-classification',
    'Processed 5,574 SMS messages with TF-IDF and evaluated binary classifiers using stratified cross-validation.',
    'Processed 5,574 SMS messages with TF-IDF and evaluated binary classifiers using stratified cross-validation.',
    'NLP',
    array['NLP', 'Machine Learning', 'TF-IDF', 'Classification'],
    array['Python', 'Scikit-learn', 'NLP', 'TF-IDF'],
    false,
    true,
    1,
    'Classify SMS text messages as spam or non-spam using a reproducible NLP workflow.',
    '5,574 SMS messages prepared for binary text classification.',
    'Preprocessed text, converted messages into TF-IDF features, and evaluated models with Stratified K-Fold cross-validation.',
    'Naive Bayes and Perceptron classifiers.',
    'Used F1-score across stratified folds to compare model behavior while accounting for class imbalance.',
    'Cross-validation provided a stable basis for comparing Naive Bayes and Perceptron classifiers on the same text representation.',
    'For imbalanced text classification, F1-score and cross-validation provide a clearer picture than accuracy alone.'
  ),
  (
    'Smart Retail Checkout System',
    'smart-retail-checkout-system',
    'Built as a three-member group project, this smart checkout prototype combines 200-SKU YOLO detection with a Django workflow for mobile capture, human review, billing, receipts, and checkout history.',
    'A three-member group project that connects real-time product detection to a usable retail checkout workflow.',
    'Computer Vision / Deep Learning / Group Project',
    array['Group Project', 'Deep Learning', 'Object Detection', 'Human-in-the-loop'],
    array['Python', 'Ultralytics YOLO', 'Django', 'AWS SageMaker', 'COCO / YOLO'],
    false,
    true,
    4,
    'Recognize multiple SKU-level products in one checkout image and convert detections into a reliable, editable bill without allowing uncertain predictions to flow directly into payment decisions.',
    'The RPC checkout-scene subset was prepared as a 200-SKU dataset with 6,000 images and 73,602 bounding boxes.',
    'Converted COCO annotations into YOLO format, compared three detectors, and integrated the selected model into a human-reviewable Django checkout workflow.',
    'YOLOv5nu, YOLOv8n, and YOLOv8s.',
    'Compared precision, recall, mAP, weighted score, convergence, inference speed, and qualitative predictions on a held-out test set.',
    'YOLOv8n achieved the strongest weighted score and was deployed in a functional desktop-and-mobile checkout prototype.',
    'Operational ML systems need transparent review and correction controls in addition to strong offline metrics.'
  ),
  (
    'Hybrid Sparse-Dense Retrieval for RAG',
    'hybrid-sparse-dense-retrieval-for-rag',
    'Evaluated BM25, dense retrieval, and Hybrid RRF in a four-member group project across 10,570 SQuAD questions; Hybrid RRF led every main metric with Recall@10 = 0.9305 and MRR = 0.7574.',
    'A four-member group project investigating retrieval quality as a bottleneck in Retrieval-Augmented Generation systems.',
    'Natural Language Processing / Group Project',
    array['Group Project', 'RAG', 'Information Retrieval', 'NLP'],
    array['Python', 'FAISS', 'Sentence Transformers', 'BM25', 'Hugging Face'],
    false,
    true,
    5,
    'Improve the document-retrieval stage of a RAG pipeline by combining complementary lexical and semantic signals.',
    'The main experiment used 10,570 SQuAD v1.1 validation questions mapped to 2,067 unique context documents.',
    'Built BM25 and FAISS dense baselines, fused their top candidates with Reciprocal Rank Fusion, and compared chunk sizes, embedding models, and failure patterns.',
    'BM25Okapi, all-MiniLM-L6-v2 dense retrieval, and Hybrid BM25-Dense RRF, with mpnet-base and bge-small in the embedding study.',
    'Measured Recall@1, Recall@3, Recall@5, Recall@10, MRR, encoding cost, and per-question top-10 outcomes.',
    'Hybrid RRF led every metric in the full validation-set experiment, reaching Recall@10 = 0.9305 and MRR = 0.7574.',
    'Retrieval evaluation should combine aggregate metrics, clearly scoped subsets, error analysis, and computational cost.'
  )
on conflict (slug) do nothing;

update public.projects
set
  description = 'Cleaned and engineered features from approximately 56,000 anonymized health records, compared five classifiers, and selected a tuned Random Forest with an F1 score of 0.7316 and ROC-AUC of approximately 0.804.',
  long_description = 'An end-to-end healthcare analytics project covering exploratory analysis, data cleaning, feature engineering, model comparison, hyperparameter tuning, and interpretable evaluation. The final Random Forest model was selected from five supervised classifiers and applied to an unseen test set.',
  year = '2025',
  category = 'Data Analytics / Machine Learning',
  tags = array['Data Analytics', 'Healthcare', 'Machine Learning', 'Feature Engineering'],
  tech_stack = array['Python', 'Pandas', 'Scikit-learn', 'Seaborn', 'GridSearchCV'],
  gallery_images = array[
    '/projects/cardiovascular-model-comparison.png',
    '/projects/cardiovascular-feature-importance.png',
    '/projects/cardiovascular-random-forest-confusion-matrix.png',
    '/projects/cardiovascular-random-forest-roc.png'
  ],
  featured = true,
  visible = true,
  sort_order = 0,
  problem = 'Predict whether an individual has cardiovascular disease from anonymized examination records while keeping the workflow reproducible and the final model interpretable.',
  dataset = 'Approximately 56,000 records with 13 attributes, including age, gender, height, weight, systolic and diastolic blood pressure, cholesterol, glucose, smoking, alcohol use, physical activity, and the binary cardio target. Cleaning retained roughly 50,000 valid records.',
  approach = 'Converted age from days to years, standardized categorical and binary fields, removed physiologically implausible blood pressure and body-measurement values, engineered BMI, filtered extreme BMI values, standardized numerical features, and used a 70/30 train-validation split.',
  models = 'Logistic Regression, Decision Tree, Random Forest, K-Nearest Neighbors, and Support Vector Machine. Random Forest hyperparameters were tuned with GridSearchCV and 5-fold cross-validation.',
  evaluation = 'Compared accuracy, validation F1, 5-fold cross-validation F1, ROC-AUC, confusion matrices, and ROC curves under the same preprocessing and validation conditions.',
  results = 'Random Forest delivered the strongest overall result with validation F1 = 0.7316, CV F1 mean = 0.7305, and ROC-AUC approximately 0.804. Feature importance identified systolic blood pressure as the strongest predictor, followed by diastolic blood pressure, age, cholesterol, and BMI. The final Kaggle submission achieved a public score of 0.62542.',
  learned = 'The project reinforced that data quality and feature engineering can matter as much as algorithm choice. It also highlighted the importance of cross-validation, threshold-aware metrics, and interpretable outputs when communicating healthcare models.'
where slug = 'cardiovascular-disease-prediction';

update public.projects
set
  description = 'Built a TF-IDF text-classification pipeline for 5,572 SMS messages and compared Perceptron with Multinomial Naive Bayes using stratified 5-fold cross-validation; Perceptron achieved a mean F1 score of 0.9147.',
  long_description = 'An end-to-end natural language processing project for classifying SMS messages as spam or ham. The workflow combines TF-IDF feature extraction, imbalance-aware cross-validation, model comparison, and a small set of realistic message tests.',
  year = '2025',
  category = 'Natural Language Processing',
  tags = array['NLP', 'Text Classification', 'TF-IDF', 'Model Evaluation'],
  tech_stack = array['Python', 'Pandas', 'Scikit-learn', 'TF-IDF', 'StratifiedKFold'],
  gallery_images = array[
    '/projects/sms-class-distribution.png',
    '/projects/sms-model-comparison.png'
  ],
  featured = false,
  visible = true,
  sort_order = 1,
  problem = 'Classify SMS messages as spam or ham with a reproducible text pipeline while accounting for class imbalance and the practical cost of incorrectly filtering legitimate messages.',
  dataset = 'The UCI SMS Spam Collection contains 5,572 labeled messages: 4,825 ham messages (86.6%) and 747 spam messages (13.4%). Labels were encoded as ham = 0 and spam = 1.',
  approach = 'Converted text into TF-IDF vectors using English stop-word removal, unigram and bigram features, a 10,000-feature limit, and sublinear term-frequency scaling. Each classifier was wrapped in a scikit-learn Pipeline and evaluated with shuffled Stratified 5-Fold cross-validation.',
  models = 'Perceptron (max_iter = 1000, tol = 1e-3, random_state = 42) and Multinomial Naive Bayes.',
  evaluation = 'Compared mean accuracy, precision, recall, and F1 across five stratified folds, with particular attention to precision-recall trade-offs caused by the imbalanced label distribution.',
  results = 'Perceptron achieved mean accuracy = 0.9772, precision = 0.9190, recall = 0.9116, and F1 = 0.9147. Naive Bayes achieved accuracy = 0.9690 and perfect precision = 1.0000, but lower recall = 0.7684 and F1 = 0.8687. Perceptron provided the stronger overall balance, while both models correctly classified all five small-scale test messages.',
  learned = 'The project demonstrated why accuracy alone can be misleading for imbalanced text data. Stratified evaluation and precision-recall analysis made the trade-off clear: Naive Bayes was highly conservative about flagging spam, while Perceptron recovered substantially more spam with a better overall F1 score.'
where slug = 'sms-spam-classification';

update public.projects
set
  description = 'Developed four PyTorch computer-vision experiments across 10-class image classification and object detection; a customized ResNet18 reached 92.43% test accuracy and SSD300 achieved 90.50% detection accuracy at IoU 0.5.',
  long_description = 'A comparative deep-learning study covering transfer learning, architectural customization, regularization, and early stopping across image classification and object detection. The work evaluated a baseline ResNet18, a deeper customized variant, Faster R-CNN, and SSD300 using reproducible data splits and visual training diagnostics.',
  year = '2026',
  category = 'Computer Vision / Deep Learning',
  tags = array['Computer Vision', 'Deep Learning', 'Transfer Learning', 'Object Detection'],
  tech_stack = array['Python', 'PyTorch', 'TorchVision', 'ResNet18', 'Faster R-CNN', 'SSD300'],
  gallery_images = array[
    '/projects/deep-learning-classification-samples.png',
    '/projects/deep-learning-customized-cnn-curves.png',
    '/projects/deep-learning-detection-sample.png',
    '/projects/deep-learning-ssd300-loss.png'
  ],
  visible = true,
  sort_order = 3,
  problem = 'Build and compare reliable CNN workflows for multi-class image classification and object localization, then test whether architectural customization improves generalization on limited datasets.',
  dataset = 'The classification dataset contains 10 dog-breed classes and was split 70%/15%/15% for training, validation, and testing using a fixed student-ID seed. Images were resized to 224 x 224 and normalized with ImageNet statistics. The detection dataset was pre-split and supplied in Pascal VOC, COCO, and YOLO formats; Pascal VOC annotations were used for the experiments.',
  approach = 'Fine-tuned an ImageNet-pretrained ResNet18, then added a 512-channel convolutional block with batch normalization, ReLU, and 0.5 dropout for the customized classifier. For detection, adapted pretrained Faster R-CNN and SSD300 prediction heads to the dataset classes, trained with SGD, monitored validation loss, and saved the best checkpoint with early stopping.',
  models = 'Baseline ResNet18 and a customized ResNet18 for 10-class classification; Faster R-CNN and SSD300 for object detection. Classification used Adam and CrossEntropyLoss, while both detectors used SGD with momentum 0.9 and weight decay 0.0005.',
  evaluation = 'Compared classification test accuracy, detection accuracy at IoU = 0.5, training and validation loss curves, convergence behavior, and early-stopping epochs. Sample class images and annotated bounding boxes were also reviewed visually.',
  results = 'The customized classifier improved test accuracy from 75.30% for baseline ResNet18 to 92.43%. For detection, SSD300 reached 90.50% accuracy at IoU = 0.5 and stopped at epoch 42, outperforming Faster R-CNN at 73.47%, which stopped at epoch 74. SSD300 also converged faster and maintained more stable validation loss on this dataset.',
  learned = 'Transfer learning provided a strong starting point, but architecture changes and regularization materially improved classification generalization. The detector comparison also showed that a simpler single-stage model can outperform a two-stage pipeline when its speed and optimization behavior better match the dataset.'
where slug = 'deep-learning-for-image-classification-object-detection';

update public.projects
set
  description = 'Compared HOG, LBP, and raw-pixel representations across RBF-SVM and MLP classifiers for 10 handwritten symbol classes; HOG with SVM achieved 99.3% test accuracy.',
  long_description = 'A controlled computer-vision experiment examining how feature representation changes multi-class recognition performance. The same balanced handwritten-symbol dataset was evaluated with classical and neural classifiers using raw pixels, HOG shape descriptors, and LBP texture features.',
  year = '2026',
  category = 'Computer Vision / Machine Learning',
  tags = array['Computer Vision', 'Feature Engineering', 'SVM', 'Neural Networks'],
  tech_stack = array['Python', 'Scikit-learn', 'HOG', 'LBP', 'SVM', 'MLP'],
  gallery_images = array[
    '/projects/handwritten-model-comparison.png',
    '/projects/handwritten-svm-hog-confusion-matrix.png',
    '/projects/handwritten-sample-predictions.png'
  ],
  visible = true,
  sort_order = 2,
  problem = 'Classify handwritten mathematical symbols despite writer-to-writer variation and visually similar stroke patterns, while determining which feature representation best preserves discriminative shape information.',
  dataset = 'A balanced dataset of 10 handwritten symbol classes: +, 3, alpha, cos, div, f, ldots, lim, q, and right arrow. Every image was converted to grayscale, resized to 64 x 64 pixels, and split 80%/20% into training and test sets.',
  approach = 'Generated three standardized feature representations: flattened raw pixels, Histogram of Oriented Gradients for edge and shape information, and Local Binary Patterns for local texture. Each representation was evaluated with the same two classifiers.',
  models = 'An RBF-kernel Support Vector Machine with C = 10 and gamma = scale, plus a Multi-Layer Perceptron with 128- and 64-unit hidden layers, ReLU activations, Adam optimization, and up to 50 iterations.',
  evaluation = 'Compared held-out test accuracy for all six classifier-feature combinations and inspected the best model''s confusion matrix and sample predictions for class-specific errors.',
  results = 'HOG produced the strongest results: 99.3% accuracy with SVM and 98.5% with MLP. Raw pixels reached 96.1% and 95.7%, while LBP fell to 61.2% and 59.1%. The SVM-HOG confusion matrix was nearly diagonal, with only a few errors among visually similar symbols such as + and f.',
  learned = 'For small visual datasets, task-aligned feature engineering can outperform greater model complexity. HOG captured the structural information needed for symbol recognition, while texture-focused LBP discarded too much of the shape signal.'
where slug = 'handwritten-mathematical-symbol-recognition';

update public.projects
set
  description = 'Built as a three-member group project, this smart checkout prototype combines 200-SKU YOLO detection with a Django workflow for mobile capture, human review, billing, receipts, and checkout history.',
  long_description = 'A three-member group project that connects real-time product detection to a usable retail checkout workflow. The team prepared a large checkout-scene dataset, compared three lightweight YOLO detectors, and integrated the selected model into a responsive Django application with desktop and mobile input, editable billing, receipts, and history management.',
  year = '2026',
  category = 'Computer Vision / Deep Learning / Group Project',
  tags = array['Group Project', 'Deep Learning', 'Object Detection', 'Human-in-the-loop'],
  tech_stack = array['Python', 'Ultralytics YOLO', 'Django', 'AWS SageMaker', 'COCO / YOLO'],
  gallery_images = array[
    '/projects/smart-retail-model-comparison.png',
    '/projects/smart-retail-system-architecture.png',
    '/projects/smart-retail-checkout-review.png',
    '/projects/smart-retail-mobile-capture.png',
    '/projects/smart-retail-detection-results.png'
  ],
  featured = false,
  visible = true,
  sort_order = 4,
  problem = 'Recognize multiple SKU-level products in one checkout image and convert detections into a reliable, editable bill without allowing uncertain predictions to flow directly into payment decisions.',
  dataset = 'The team repurposed the RPC val2019 checkout-scene subset into a closed-set dataset with 200 SKU classes across 17 product categories, 6,000 images, and 73,602 bounding boxes. Easy, Medium, and Hard scenes were stratified into an 80/10/10 train-validation-test split, producing 4,800 training, 600 validation, and 600 test images.',
  approach = 'Converted COCO annotations into YOLO format, trained three lightweight detectors under shared settings, and mapped predictions to product names, quantities, prices, GST, and totals. The selected model was integrated into a layered Django system supporting local upload, demo images, mobile QR capture, low-confidence warnings, manual corrections, receipt generation, and checkout history.',
  models = 'YOLOv5nu, YOLOv8n, and YOLOv8s were trained at 640 x 640 for up to 300 epochs with batch size 8 and early stopping patience 50 on an AWS SageMaker ml.g4dn.xlarge instance with an NVIDIA Tesla T4 GPU.',
  evaluation = 'Compared precision, recall, mAP@0.5, mAP@0.5:0.95, a predefined weighted score, inference speed, convergence curves, precision-recall curves, F1-confidence curves, and qualitative checkout-scene predictions on the held-out test set.',
  results = 'YOLOv8n was selected for deployment with precision = 0.99183, recall = 0.99476, mAP@0.5 = 0.99389, mAP@0.5:0.95 = 0.87068, and the highest weighted score of 0.93221. The Django prototype successfully connected image submission, SKU aggregation, editable bill review, receipt generation, and transaction history.',
  learned = 'The group project showed that strong detection metrics are only one part of an operational ML system. Closed-set recognition, occlusion, visually similar packaging, and low-confidence predictions make human review and transparent correction controls essential for dependable checkout assistance.'
where slug = 'smart-retail-checkout-system';

update public.projects
set
  description = 'Evaluated BM25, dense retrieval, and Hybrid RRF in a four-member group project across 10,570 SQuAD questions; Hybrid RRF led every main metric with Recall@10 = 0.9305 and MRR = 0.7574.',
  long_description = 'A four-member group project investigating retrieval quality as a bottleneck in Retrieval-Augmented Generation systems. The study combines lexical and semantic retrieval through Reciprocal Rank Fusion, then tests retrieval methods, chunk sizes, embedding models, efficiency trade-offs, and per-question failure patterns.',
  year = '2026',
  category = 'Natural Language Processing / Group Project',
  tags = array['Group Project', 'RAG', 'Information Retrieval', 'NLP'],
  tech_stack = array['Python', 'FAISS', 'Sentence Transformers', 'BM25', 'Hugging Face'],
  gallery_images = array[
    '/projects/rag-retrieval-comparison.png',
    '/projects/rag-chunking-comparison.png',
    '/projects/rag-embedding-model-comparison.png',
    '/projects/rag-error-analysis.png'
  ],
  featured = false,
  visible = true,
  sort_order = 5,
  problem = 'Improve the document-retrieval stage of a RAG pipeline, where lexical mismatch can cause BM25 to miss semantically relevant documents and dense retrieval can overlook useful exact-term signals.',
  dataset = 'The main experiment used the complete SQuAD v1.1 validation set: 10,570 questions mapped to 2,067 unique context documents. Chunking, embedding-model comparison, and per-question error analysis used reproducible 2,000-question subsets for computational efficiency.',
  approach = 'Built a BM25 lexical baseline and a dense FAISS index using normalized sentence-transformer embeddings. Hybrid retrieval fused the top 50 candidates from both rankers with Reciprocal Rank Fusion using k = 60. Additional experiments compared 100-, 200-, and 400-word chunks, three embedding models, and method-specific failure cases.',
  models = 'BM25Okapi, all-MiniLM-L6-v2 dense retrieval, and Hybrid BM25-Dense RRF formed the main comparison. The embedding study additionally evaluated all-mpnet-base-v2 and BAAI bge-small-en-v1.5.',
  evaluation = 'Measured Recall@1, Recall@3, Recall@5, Recall@10, and Mean Reciprocal Rank. Secondary experiments compared corpus encoding time, embedding dimensionality, chunk-count trade-offs, and per-question top-10 retrieval outcomes.',
  results = 'On the full validation set, Hybrid RRF achieved Recall@1 = 0.6700, Recall@5 = 0.8749, Recall@10 = 0.9305, and MRR = 0.7574, leading both BM25 and dense retrieval on every main metric. On the 2,000-question embedding subset, bge-small produced the best Recall@1 and MRR, while mpnet-base achieved the highest Recall@10 at substantially greater encoding cost.',
  learned = 'Sparse and dense signals were complementary, but the error analysis also showed that fusion is not automatically best for every subset or cutoff. Retrieval conclusions should therefore state the evaluation population clearly and balance aggregate metrics with question-level failure analysis and computational cost.'
where slug = 'hybrid-sparse-dense-retrieval-for-rag';

insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read portfolio images" on storage.objects;
create policy "Public can read portfolio images"
on storage.objects for select
using (bucket_id = 'portfolio-images');

drop policy if exists "Admin can upload portfolio images" on storage.objects;
create policy "Admin can upload portfolio images"
on storage.objects for insert
with check (bucket_id = 'portfolio-images' and public.is_portfolio_admin());

drop policy if exists "Admin can update portfolio images" on storage.objects;
create policy "Admin can update portfolio images"
on storage.objects for update
using (bucket_id = 'portfolio-images' and public.is_portfolio_admin())
with check (bucket_id = 'portfolio-images' and public.is_portfolio_admin());

drop policy if exists "Admin can delete portfolio images" on storage.objects;
create policy "Admin can delete portfolio images"
on storage.objects for delete
using (bucket_id = 'portfolio-images' and public.is_portfolio_admin());
