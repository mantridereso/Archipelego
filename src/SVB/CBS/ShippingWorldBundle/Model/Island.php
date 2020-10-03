<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 24.09.15
 * Time: 16:12
 */

namespace SVB\CBS\ShippingWorldBundle\Model;

use HireVoice\Neo4j\Annotation as OGM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Class Island
 * @package SVB\CBS\ShippingWorldBundle\Model
 *
 * @OGM\Entity(labels="Island")
 */
class Island implements IslandInterface
{

    /**
     * @OGM\Auto
     */
    private $id;

    /**
     * @var string
     *
     * @OGM\Property
     * @OGM\Index
     */
    private $name;

    /**
     * @var WorldInterface
     *
     * @OGM\ManyToOne(relation="island_within_world",direction="from")
     */
    private $world;

    /**
     * @var int
     *
     * @OGM\Property
     */
    private $positionX;

    /**
     * @var int
     *
     * @OGM\Property
     */
    private $positionY;

    /**
     * @var int
     *
     * @OGM\Property
     */
    private $extent;

    /**
     * @var int
     *
     * @OGM\Property
     */
    private $gestalt;

    /**
     * @var string
     *
     * //TODO introduce explicit Language Entity/Node type
     *
     * @OGM\Property
     * @OGM\Index
     */
    private $nativeLanguage;

    /**
     * @var ArrayCollection|VillageInterface[]
     *
     * collection of VillageInterface
     *
     * @OGM\ManyToMany(relation="situated_on_island",direction="to")
     */
    private $villages;

    /**
     * @var VillageInterface
     *
     * @OGM\ManyToOne(relation="is_capital_of",direction="to")
     */
    private $capital;


    public function __construct(){
        $this->villages = new ArrayCollection();
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return Island
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     * @return Island
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return WorldInterface
     */
    public function getWorld()
    {
        return $this->world;
    }

    /**
     * @param WorldInterface $world
     * @return Island
     */
    public function setWorld($world)
    {
        $this->world = $world;
        return $this;
    }

    /**
     * @return string
     */
    public function getNativeLanguage()
    {
        return $this->nativeLanguage;
    }

    /**
     * @param string $nativeLanguage
     * @return Island
     */
    public function setNativeLanguage($nativeLanguage)
    {
        $this->nativeLanguage = $nativeLanguage;
        return $this;
    }

    /**
     * @return ArrayCollection|VillageInterface[]
     */
    public function getVillages()
    {
        return $this->villages;
    }

    /**
     * @param VillageInterface $village
     * @return Island
     */
    public function addVillage(VillageInterface $village){
        $this->villages->add($village);
        return $this;
    }

    /**
     * @return VillageInterface
     */
    public function getCapital()
    {
        return $this->capital;
    }

    /**
     * @param VillageInterface $capital
     * @return Island
     */
    public function setCapital(VillageInterface $capital)
    {
        $this->capital = $capital;
        return $this;
    }

    /**
     * @return int
     */
    public function getPositionX()
    {
        return $this->positionX;
    }

    /**
     * @param int $positionX
     * @return Island
     */
    public function setPositionX($positionX)
    {
        $this->positionX = $positionX;
        return $this;
    }

    /**
     * @return int
     */
    public function getPositionY()
    {
        return $this->positionY;
    }

    /**
     * @param int $positionY
     * @return Island
     */
    public function setPositionY($positionY)
    {
        $this->positionY = $positionY;
        return $this;
    }

    /**
     * @return int
     */
    public function getExtent()
    {
        return $this->extent;
    }

    /**
     * @param int $extent
     * @return Island
     */
    public function setExtent($extent)
    {
        $this->extent = $extent;
        return $this;
    }

    /**
     * @return int
     */
    public function getGestalt()
    {
        return $this->gestalt;
    }

    /**
     * @param int $gestalt
     * @return Island
     */
    public function setGestalt($gestalt)
    {
        $this->gestalt = $gestalt;
        return $this;
    }



    /**
     * @return Island
     */
    public static function create(){
        return new Island();
    }

    /**
     * @return array
     */
    public function export()
    {
        return [
            'name' => $this->getName(),
            'position' => [
                'x' => $this->getPositionX(),
                'y' => $this->getPositionY()
            ],
            'extent' => $this->getExtent(),
            'gestalt' => [
                'seed' => $this->getGestalt(),
                'N' => 10,
                'SIGMA' => 2
            ]
        ];
    }
}