import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommentsPanel } from '@/components/CommentsPanel';
import { MorePanel } from '@/components/MorePanel';
import { ListenButton } from '@/components/ListenButton';
import { books, getBook, type Book } from '@/lib/books';
import { colors } from '@/constants/theme';
import { goBack } from '@/lib/navigation';

function BookCard({ book }: { book: Book }) {
  return <Pressable style={styles.card} onPress={() => router.push(`/book/${book.id}`)}><Image source={book.cover} style={styles.cardCover} contentFit="cover" /><Text style={styles.cardTitle} numberOfLines={2}>{book.title}</Text><Text style={styles.cardAuthor}>{book.author}</Text></Pressable>;
}

function longFormSections(book: Book) {
  const [first, second, third] = book.ideas;
  return [
    { heading: 'Overview', paragraphs: [
      `${book.title} by ${book.author} presents a sustained argument about ${book.category.toLowerCase()} and the patterns that shape everyday judgment. ${book.summary} Rather than treating its subject as a collection of isolated tips, the book connects individual choices to broader systems, incentives, environments, and habits. Its value lies in giving readers a framework they can return to when a decision feels confusing or when a familiar approach stops producing useful results.`,
      `The book is best read as an invitation to observe more carefully. It asks readers to look beyond a single outcome, identify the process that produced it, and notice which conditions repeat. That perspective makes the material practical without reducing it to a checklist: the goal is to understand why an idea works, where it may fail, and how it can be adapted responsibly.`
    ]},
    { heading: 'Ideas', paragraphs: [
      `${first.heading} is the first major idea. ${first.body} The argument becomes more useful when it is considered over time, because small decisions often reveal their importance only after they accumulate. A single action may look insignificant, while a repeated pattern can alter skills, expectations, opportunities, or behavior.`,
      `${second.heading} extends that reasoning. ${second.body} ${third.heading} completes the core set of ideas: ${third.body} Together, these principles show how the book moves between explanation and action. Each idea supports the others, so readers gain more by treating them as a connected system than as independent slogans.`
    ]},
    { heading: 'Concepts', paragraphs: [
      `A central concept is the difference between visible results and the underlying structure that produces them. Results attract attention because they are concrete, but they can hide the role of timing, context, accumulated effort, and constraints. ${book.author} encourages readers to examine those less visible forces before drawing conclusions or changing direction.`,
      `Another concept is feedback. Choices produce information, and that information can improve the next choice when it is interpreted carefully. Useful feedback is specific, timely, and connected to an action the reader can adjust. Weak feedback encourages overconfidence or discouragement. The book therefore favors deliberate observation, meaningful comparison, and revision over instinctive reactions to one success or failure.`
    ]},
    { heading: 'Insights', paragraphs: [
      `One important insight is that knowing an idea is not the same as using it. Familiar language can create an illusion of mastery, while application exposes what a reader truly understands. The book repeatedly closes that gap by linking abstract principles to recognizable decisions and asking what would change if the principle were taken seriously.`,
      `A second insight is that context matters. Advice that works in one environment may need to be adjusted in another, and apparent contradictions often reflect different constraints rather than a simple right-or-wrong answer. Readers should preserve the mechanism behind an idea while adapting its expression. This produces a more durable understanding than copying an example without examining why it succeeded.`
    ]},
    { heading: 'Application', paragraphs: [
      `To apply the book, begin with one real situation rather than attempting a complete personal overhaul. Describe the present outcome, the recurring process behind it, and the conditions that make the current pattern easier to repeat. Then choose one modest adjustment connected to ${first.heading.toLowerCase()}. Define what improvement would look like and observe the result long enough to distinguish a pattern from ordinary variation.`,
      `Next, review the experiment through the lens of ${second.heading.toLowerCase()} and ${third.heading.toLowerCase()}. Keep a brief record of what happened, what was expected, and what was learned. If the result improves, preserve the useful conditions. If it does not, revise the process without treating the attempt as wasted effort. This approach turns reading into a cycle of prediction, action, feedback, and refinement.`
    ]},
    { heading: 'Takeaways', paragraphs: [
      `The main takeaway is that better outcomes usually come from understanding and improving the process beneath them. ${book.title} supplies language for identifying that process and for recognizing the habits, assumptions, environments, and incentives that keep it in place. Its strongest lessons are cumulative: observation improves judgment, clearer judgment improves action, and repeated action makes progress more durable.`,
      `Readers do not need to accept every example or apply every suggestion at once. A more useful response is to select the ideas that address a current need, test them in a limited and reversible way, and evaluate the evidence honestly. The book ultimately offers a disciplined way to think: slow down when necessary, make important forces visible, learn from feedback, and build changes that can survive beyond initial motivation.`
    ]},
  ];
}

export default function BookSummary() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const book = getBook(id) ?? books[0];
  const insets = useSafeAreaInsets();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const similar = books.filter(item => item.id !== book.id).slice(0, 3);
  const recommended = books.filter(item => item.id !== book.id && !similar.includes(item)).slice(0, 4);
  const sections = longFormSections(book);
  const openBook = () => WebBrowser.openBrowserAsync(book.sourceUrl, { presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET, dismissButtonStyle: 'close', enableBarCollapsing: true, controlsColor: '#000' });
  const tap = (action: () => void) => { Haptics.selectionAsync().catch(() => undefined); action(); };
  const bookText = `${book.title} by ${book.author}. ${sections.map(section => `${section.heading}. ${section.paragraphs.join(' ')}`).join(' ')}`;
  const learningPath = book.category === 'Finance' ? 'finance' : book.category === 'History' ? 'history' : book.category === 'Science' ? 'science' : book.category === 'Psychology' || book.category === 'Decision-making' ? 'psychology' : 'design';
  return <SafeAreaView style={styles.screen}>
    <View style={styles.nav}>
      <Pressable accessibilityLabel="Back" onPress={() => goBack()} hitSlop={12}><Ionicons name="chevron-back" size={27} color="#fff" /></Pressable>
      <View style={styles.topActions}>
        <Pressable accessibilityLabel={liked ? 'Unlike' : 'Like'} hitSlop={8} onPress={() => tap(() => setLiked(value => !value))}><Ionicons name={liked ? 'heart' : 'heart-outline'} size={21} color={liked ? '#FF453A' : '#fff'} /></Pressable>
        <Pressable accessibilityLabel="Comments" hitSlop={8} onPress={() => tap(() => setCommentsOpen(true))}><Ionicons name="chatbubble-outline" size={20} color="#fff" /></Pressable>
        <Pressable accessibilityLabel="Share" hitSlop={8} onPress={() => tap(() => Share.share({ message: `${book.title} by ${book.author}\n${book.sourceUrl}` }))}><Ionicons name="paper-plane-outline" size={20} color="#fff" /></Pressable>
        <Pressable accessibilityLabel={saved ? 'Remove bookmark' : 'Save book'} hitSlop={8} onPress={() => tap(() => setSaved(value => !value))}><Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color="#fff" /></Pressable>
        <Pressable accessibilityLabel="More options" hitSlop={8} onPress={() => tap(() => setMoreOpen(true))}><Ionicons name="ellipsis-horizontal" size={21} color="#fff" /></Pressable>
      </View>
    </View>
    <View style={styles.inlineVoice}><ListenButton text={bookText} iconOnly /></View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}><Image source={book.cover} style={styles.cover} contentFit="cover" /><View style={styles.heroCopy}><Text style={styles.category}>{book.category}</Text><Text style={styles.title}>{book.title}</Text><Text style={styles.author}>By {book.author}</Text><Text style={styles.readTime}>BOOK SUMMARY · 8 MIN READ</Text></View></View>
      {sections.map(section => <View key={section.heading} style={styles.idea}><View style={styles.ideaCopy}><Text style={styles.ideaTitle}>{section.heading}</Text>{section.paragraphs.map((paragraph, paragraphIndex) => <Text key={`${section.heading}-${paragraphIndex}`} style={[styles.ideaBody, paragraphIndex > 0 && { marginTop: 14 }]}>{paragraph}</Text>)}</View></View>)}
      <Pressable style={styles.fullBook} onPress={openBook}><View><Text style={styles.fullLabel}>Read full book</Text><Text style={styles.fullSource}>{book.sourceLabel}</Text></View><Ionicons name="arrow-up-outline" size={18} color="#fff" style={styles.externalArrow} /></Pressable>
      {similar.length > 0 && <><Text style={styles.shelfTitle}>Similar books</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>{similar.map(item => <BookCard key={item.id} book={item} />)}</ScrollView></>}
      <Text style={styles.shelfTitle}>Recommended books</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>{recommended.map(item => <BookCard key={item.id} book={item} />)}</ScrollView>
    </ScrollView>
    <CommentsPanel visible={commentsOpen} onClose={() => setCommentsOpen(false)} itemId={`book-${book.id}`} topOffset={insets.top + 52} />
    <MorePanel visible={moreOpen} onClose={() => setMoreOpen(false)} edge="top" topOffset={insets.top + 52} title="About this book" summary={book.summary} actions={[
      { label: 'Voice', icon: 'mic-outline', onPress: () => { setMoreOpen(false); router.push('/settings/read-aloud?only=voice'); } },
      { label: 'Speed', icon: 'speedometer-outline', onPress: () => { setMoreOpen(false); router.push('/settings/read-aloud?only=speed'); } },
      { label: 'Interested', icon: 'thumbs-up-outline', onPress: () => { setMoreOpen(false); Alert.alert('Thanks', 'We’ll recommend more books like this.'); } },
      { label: 'Not interested', icon: 'thumbs-down-outline', onPress: () => { setMoreOpen(false); Alert.alert('Noted', 'We’ll show fewer books like this.'); } },
      { label: 'Study this topic', icon: 'book-outline', onPress: () => { setMoreOpen(false); router.push(`/path/${learningPath}`); } },
      { label: 'View full book', icon: 'open-outline', onPress: () => { setMoreOpen(false); openBook(); } },
    ]} />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:'#000'}, nav:{height:52,paddingHorizontal:18,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}, topActions:{flexDirection:'row',alignItems:'center',gap:17}, inlineVoice:{position:'absolute',zIndex:12,top:124,right:18,width:24,alignItems:'center'}, content:{paddingBottom:110}, hero:{padding:20,flexDirection:'row',gap:20,alignItems:'flex-start'}, cover:{width:126,height:188,borderRadius:9,backgroundColor:colors.card}, heroCopy:{flex:1,paddingTop:2}, category:{color:colors.secondary,fontSize:10,fontWeight:'800',letterSpacing:1.4,textTransform:'uppercase'}, title:{color:'#fff',fontSize:27,lineHeight:31,fontWeight:'700',letterSpacing:-.6,marginTop:9}, author:{color:'rgba(255,255,255,.7)',fontSize:13,marginTop:9}, readTime:{color:colors.tertiary,fontSize:9,fontWeight:'700',letterSpacing:1,marginTop:20}, summaryHeading:{color:'#fff',fontSize:20,fontWeight:'700',marginHorizontal:20,marginTop:24}, summary:{color:'rgba(255,255,255,.7)',fontSize:16,lineHeight:25,marginHorizontal:20,marginTop:12}, idea:{marginHorizontal:20,paddingVertical:23}, ideaCopy:{flex:1}, ideaTitle:{color:'#fff',fontSize:20,fontWeight:'700'}, ideaBody:{color:'rgba(255,255,255,.7)',fontSize:16,lineHeight:25,marginTop:10}, fullBook:{alignSelf:'flex-start',marginHorizontal:20,paddingVertical:22,flexDirection:'row',alignItems:'center',gap:9}, externalArrow:{transform:[{rotate:'45deg'}]}, fullLabel:{color:'#fff',fontSize:15,fontWeight:'700'}, fullSource:{color:colors.secondary,fontSize:11,marginTop:5}, shelfTitle:{color:'#fff',fontSize:19,fontWeight:'700',marginHorizontal:20,marginTop:32,marginBottom:13}, rail:{paddingHorizontal:20,gap:13}, card:{width:118}, cardCover:{width:118,height:172,borderRadius:8,backgroundColor:colors.card}, cardTitle:{color:'#fff',fontSize:13,lineHeight:17,fontWeight:'700',marginTop:8}, cardAuthor:{color:colors.secondary,fontSize:10,marginTop:3},
});
